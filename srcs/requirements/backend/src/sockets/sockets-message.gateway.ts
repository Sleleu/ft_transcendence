import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto, JoinRoomDto, RoomObj, TypingDto, UserDto } from './entities/message.entity';
import { ForbiddenException } from '@nestjs/common';
import { MessageService } from './message.service';
import { copyFileSync } from 'fs';
import * as argon from 'argon2';
import { use } from 'passport';
import { User } from '@prisma/client';

export interface Message {
	id: number;
	author: User;	
	text: string;
}

export interface ChatRoomData {
	whitelist: User[];
	admins: User[];
	banned: User[];
	connected: User[];
	friends: User[];
	blocked : User[];  
	room: RoomObj;
	owner: User | null;
  }


@WebSocketGateway({ cors: true })
export class SocketsChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;

	afterInit() {
		console.log('WebSocket Gateway initialized');
	  }

	  handleConnection(client: Socket) {
		// console.log('Client connected:', client.id);
	  }

	  handleDisconnect(client: Socket) {
		// console.log('Client disconnected:', client.id);
	}

	constructor(
		private readonly socketService: SocketsService,
		private readonly messagesService: MessageService) {}

	@SubscribeMessage('findAllRooms')
	findAllRooms(@ConnectedSocket() client: Socket) {
		const user = this.socketService.getUser(client.id);
		const rooms = this.messagesService.getRoomsForUser(user);
		return rooms;
	}
	@SubscribeMessage('owner')
	async owner(@MessageBody('roomId') roomId: number,) {
		const owner = await this.messagesService.owner(roomId);
		if (!owner)
			throw new ForbiddenException('No owner found');
		return owner;
	}
	@SubscribeMessage('createRoom')
	async createRoom(@MessageBody('roomName') roomName: string,
	@MessageBody('type') type: string,
	@ConnectedSocket() client: Socket) {
		console.log(roomName);
		try {
			if (roomName.length > 14)
				throw new ForbiddenException('Room name too long');
			const user = this.socketService.getUser(client.id);
			const exists = await this.messagesService.getRoomByName(roomName);
			if (exists)
				throw new ForbiddenException('Room alerady exists');
			const room = await this.messagesService.createRoom(user.id, roomName, type);
			this.messagesService.addWhitelistUser(room.id, user.id);
			this.messagesService.promoteAdmin(room.id, user.id);
			if (room.type === 'private')
				client.emit('newRoom', room);
			else
				this.server.emit('newRoom', room);
			return room;
		}
		catch (e) {
			client.emit('createError', { message: e.message });
		}
	}

	@SubscribeMessage('verifyPassword')
	async verifyPassword(@MessageBody('roomId') roomId: number,
	@MessageBody('password') password: string,
	@ConnectedSocket() client: Socket) {
		try {
			const room = await this.messagesService.getRoomById(roomId);
			if (!room)
				throw new ForbiddenException('Room does not exist');
				const user = this.socketService.getUser(client.id);
				const admin = await this.messagesService.isAdmin(room.id, user.id);
				
			if (room.type != 'protected' || admin)
				client.emit('passSuccess', {id: room.id});
			else
			{
				if (!password || !room.password)
					throw new ForbiddenException('Access Forbidden');
				const passwordMatch = await argon.verify(room.password, password);
				if (!passwordMatch)
					throw new ForbiddenException('Wrong password provided');
			}
			client.emit('passSuccess', {id: room.id});
		} catch (e) {
			client.emit('passError', { message: e.message });
		}
	}
	@SubscribeMessage('join')
	async joinRoom(@MessageBody('roomId') roomId: number,
	 @ConnectedSocket() client: Socket) {
		try {
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const user = this.socketService.getUser(client.id);
		const banned = await this.messagesService.isBanned(room.id, user.id)
		if (banned)
			throw new ForbiddenException('Access to room forbidden : user banned');
		const whitelisted = await this.messagesService.searchWhiteList(room.id, user.id)
		if (room.type === 'private')
		{
		  if (!whitelisted)
			throw new ForbiddenException('Access to private room forbidden');
		}
		client.join(roomId.toString());
		console.log(user.username, 'joined room :', room.name);
		if (room.type === 'protected' || room.type === 'public')
		{
			if (!whitelisted)
			{
				await this.messagesService.addWhitelistUser(room.id, user.id);
				this.server.to(roomId.toString()).emit('refreshWhiteList', user, false);
			}
		}
		await this.messagesService.connectedUser(room.id, user.id);
		client.emit('joinSuccess', room.name);
		this.server.to(roomId.toString()).emit('refreshConnected', user, false);
	} catch (e) {
		client.emit('joinError',  e.message );
	}
	}

	@SubscribeMessage('leave')
	async leaveRoom(@ConnectedSocket() client: Socket,
	@MessageBody('roomId') roomId: number) {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('No room found');
		client.leave(roomId.toString());
		await this.messagesService.disconnectedUser(room.id, user.id);
		this.server.to(roomId.toString()).emit('refreshConnected', user, true);
		console.log(user.username, 'left room :', room.name);
	}


	@SubscribeMessage('findRoomMessages')
	findRoom(@MessageBody('id') id: number) {
	  const messages = this.messagesService.getMessagesByRoom(id);
	  return messages;
	}
	
	@SubscribeMessage('createMessage')
	async create(
	@MessageBody('roomId') roomId: number,
	@MessageBody('text') text: string,
	@ConnectedSocket() client: Socket) {
	try {
	  const user = this.socketService.getUser(client.id);
	  const room = await this.messagesService.getRoomById(roomId);
	  if (!room)
		  throw new ForbiddenException('Room does not exist');
	  const banned = await this.messagesService.isBanned(room.id, user.id);
	  if (banned)
	  	throw new ForbiddenException('You are banned from this room !');
	const muted = await this.messagesService.isMuted(room.id, user.id);
	if (muted)
		throw new ForbiddenException('You are muted from this room !');
	  const message = await this.messagesService.createMessage(user.id, text, roomId);
	  this.server.to(room.id.toString()).emit('refreshMessages', message, false);
	  this.server.emit('newMessage', message);
	  return message;
	} catch (e) {
		client.emit('msgError', { message: e.message });
	}
	}

	@SubscribeMessage('promoteAdmin')
	async promoteAdmin(@MessageBody('targetId') target: number,
	@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket)
	{
		try {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const userTarget = await this.messagesService.searchUserId(target);
		if (!userTarget)
			throw new ForbiddenException('Target does not exist');
		const targetIsBanned = await this.messagesService.isBanned(room.id, userTarget.id);
		if (targetIsBanned)
			throw new ForbiddenException('Cannot promote a banned user');
		const aleradyAdmin = await this.messagesService.isAdmin(room.id, userTarget.id);
		if (aleradyAdmin)
			throw new ForbiddenException('User is alerady an admin');
		this.messagesService.promoteAdmin(room.id, userTarget.id);
		this.server.to(roomId.toString()).emit('refreshAdmins', userTarget, false);
	} catch (e) {
		client.emit('msgError', { message: e.message });
	}
}
	@SubscribeMessage('demoteAdmin')
	async demoteAdmin(@MessageBody('targetId') target: number,
	@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket)
	{
		try {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const userTarget = await this.messagesService.searchUserId(target);
		if (!userTarget)
			throw new ForbiddenException('Target does not exist');
		const owner = await this.messagesService.owner(roomId);
		if (target === owner?.id)
			throw new ForbiddenException('Cannot demote the owner !');
		const wasAdmin = this.messagesService.isAdmin(room.id, userTarget.id);
		if (!wasAdmin)
			throw new ForbiddenException('User is not an admin');
		this.messagesService.demoteAdmin(room.id, userTarget.id);
		this.server.to(roomId.toString()).emit('refreshAdmins', userTarget, true);
	} catch (e) {
		client.emit('msgError', { message: e.message });
	}
}
	@SubscribeMessage('ban')
	async ban(@MessageBody('targetId') target: number,
	@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket)
	{
		try {

			const user = this.socketService.getUser(client.id);
			const room = await this.messagesService.getRoomById(roomId);
			if (!room)
			throw new ForbiddenException('Room does not exist');
			const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
			if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
			const userTarget = await this.messagesService.searchUserId(target);
			if (!userTarget)
			throw new ForbiddenException('Target does not exist');
			const owner = await this.messagesService.owner(roomId);
			if (target === owner?.id)
			throw new ForbiddenException('Cannot ban the owner !');
		const targetIsBanned = await this.messagesService.isBanned(room.id, userTarget.id);
		if (targetIsBanned)
		throw new ForbiddenException('Target Alerady Banned');
		this.messagesService.ban(room.id, userTarget.id);
		const kickedId = this.socketService.findSocketById(userTarget.id);
		if (!kickedId)
		throw new ForbiddenException('Invalid target client ID');
		const kickedClient = this.server.sockets.sockets.get(kickedId);
		if (!kickedClient)
		throw new ForbiddenException('Invalid target');
		const isConnected = await this.messagesService.isConnected(room.id, userTarget.id);
		if (isConnected)
		kickedClient.emit('kickUser', {name: room.name});
		this.server.to(room.id.toString()).emit('refreshBanned', userTarget, false);
		} catch (e) {
			client.emit('msgError', { message: e.message });
		}
	}
	@SubscribeMessage('unban')
	async unban(@MessageBody('targetId') target: number,
	@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket)
	{
		try {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const userTarget = await this.messagesService.searchUserId(target);
		if (!userTarget)
			throw new ForbiddenException('Target does not exist');
		const targetIsBanned = await this.messagesService.isBanned(room.id, userTarget.id);
		if (!targetIsBanned)
			throw new ForbiddenException('Target is not Banned');
		this.messagesService.unban(room.id, userTarget.id);
		this.server.to(room.id.toString()).emit('refreshBanned', userTarget, true);
		this.messagesService.removeWhitelistUser(room.id, userTarget.id);
		this.server.to(room.id.toString()).emit('refreshWhiteList', userTarget, true);


	} catch (e) {
		client.emit('msgError', { message: e.message });
	}
}

	@SubscribeMessage('mute')
	async mute(@MessageBody('targetId') target: number,
	@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket)
	{
		try {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const userTarget = await this.messagesService.searchUserId(target);
		if (!userTarget)
			throw new ForbiddenException('Target does not exist');
		const owner = await this.messagesService.owner(roomId);
		if (target === owner?.id)
			throw new ForbiddenException('Cannot mute the owner !');
		this.messagesService.mute(room.id, userTarget.id);
	} catch (e) {
		client.emit('msgError', { message: e.message });
	}
}
	@SubscribeMessage('unmute')
	async unmute(@MessageBody('targetId') target: number,
	@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket)
	{
		try {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const userTarget = await this.messagesService.searchUserId(target);
		if (!userTarget)
			throw new ForbiddenException('Target does not exist');
		this.messagesService.unmute(room.id, userTarget.id);
	} catch (e) {
		client.emit('msgError', { message: e.message });
	}
}

	@SubscribeMessage('kick')
	async kick(@MessageBody('targetId') targetId: number,
	@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket)
	{
		try {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const owner = await this.messagesService.owner(roomId);
		if (targetId === owner?.id)
			throw new ForbiddenException('Cannot kick the owner !');
		const kickedId = this.socketService.findSocketById(targetId);
		if (!kickedId)
			throw new ForbiddenException('Invalid target client ID');
		const kickedClient = this.server.sockets.sockets.get(kickedId);
		if (!kickedClient)
			throw new ForbiddenException('Invalid target');
		const isConnected = await this.messagesService.isConnected(room.id, targetId);
		if (isConnected)
			kickedClient.emit('kickUser', {name: room.name});
		const target = await this.messagesService.searchUserId(targetId);
		if (!target)
			return;
		this.messagesService.removeWhitelistUser(room.id, target.id);
		this.server.to(room.id.toString()).emit('refreshWhiteList', target, true);

	} catch (e) {
			client.emit('msgError', { message: e.message });
		}
}

	@SubscribeMessage('popupInfos')
	async popupInfos(@MessageBody('id') id: number, @MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket) {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const target = await this.messagesService.searchUserId(id);
		if (!target)
			throw new ForbiddenException('Target does not exist');
		const isClientAdmin = await this.messagesService.isAdmin(room.id, user.id);
		const isAdmin = await this.messagesService.isAdmin(room.id, target.id);
		const isBanned = await this.messagesService.isBanned(room.id, target.id);
		const isMuted = await this.messagesService.isMuted(room.id, target.id);
		return ({ban: isBanned, mute: isMuted, admin: isAdmin, clientAdmin: isClientAdmin});
	}
	@SubscribeMessage('isAdmin')
	async isAdmin(@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket) {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const isClientAdmin = await this.messagesService.isAdmin(room.id, user.id);
		return isClientAdmin;
	}
	@SubscribeMessage('isConnected')
	async isConnected(@MessageBody('roomId') roomId: number, @MessageBody('userId') userId: number) {
		const isConnected = this.messagesService.isConnected(roomId, userId);
		return isConnected;
	}

	@SubscribeMessage('createDirectMessage')
	async createDirectMessage(@MessageBody('targetId') targetId: number,
	@ConnectedSocket() client: Socket) {
		const userA = await this.socketService.getUser(client.id);
		const userB = await this.messagesService.searchUserId(targetId);
		if (!userA || !userB)
			throw new ForbiddenException('User does not exist');
		const roomExists = await this.messagesService.findDirectMsg(userA.id, userB.id);
		if (roomExists)
		{
			client.join(roomExists.id.toString());
			client.emit('joinSuccess', {id: roomExists.id, roomName: roomExists.name});
		}
		else
		{
			const room = await this.messagesService.createDirectMsg(userA, userB);
			if (!room)
				throw new ForbiddenException('Room cannot be created');
			client.join(room.id.toString());
			const friendId = this.socketService.findSocketById(targetId);
			if (!friendId)
				throw new ForbiddenException('Invalid target client ID');
			const friendClient = this.server.sockets.sockets.get(friendId);
			if (!friendClient)
				throw new ForbiddenException('Invalid target');
			client.emit('newRoom', room);
			friendClient.emit('newRoom', room);
			client.emit('joinSuccess', {id: room.id, roomName: room.name});
		}
	}

	@SubscribeMessage('deleteRoom')
	async deleteRoom(@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket)
	{
		try {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		this.messagesService.deleteRoom(room.id);
		this.server.emit('deleted', room.id);
		this.server.to(roomId.toString()).emit('kickUser', {name: room.name});
		} catch (e) {
		client.emit('msgError', { message: e.message });
	}
}

	@SubscribeMessage('addToChat')
	async addToChat(@MessageBody('friendId') friendId: number,
	@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket) {
		try {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('User is not an admin');
		const target = await this.messagesService.searchUserId(friendId);
		if (!target)
			throw new ForbiddenException('Target does not exist');
		this.messagesService.addWhitelistUser(room.id, friendId);
		this.server.to(room.id.toString()).emit('refreshWhiteList', target, false);
		const friendSocket = this.socketService.findSocketById(friendId);
		if (!friendSocket)
			throw new ForbiddenException('Invalid target client ID');
		const friendClient = this.server.sockets.sockets.get(friendSocket);
		if (!friendClient)
			throw new ForbiddenException('Invalid target');
		if (room.type === 'private' || room.type === 'direct')
			friendClient.emit('newRoom', room);
		}
		catch (e) {
			client.emit('msgError', { message: e.message });
		}
	}

	@SubscribeMessage('isWhitelisted')
	async isWhitelisted(@ConnectedSocket() client: Socket, @MessageBody('roomName') roomName: string,) {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomByName(roomName);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const isWhiteListed = await this.messagesService.searchWhiteList(room.id, user.id);
		return isWhiteListed;
	}

	//Ne fonctionne plus pour le moment
	// @SubscribeMessage('typing')
	// async typing(@MessageBody() dto: TypingDto, @ConnectedSocket() client: Socket) {
	//   const user = await this.socketService.getUser(client.id);
	//   const username = user.username;
	//   const typing = dto.isTyping;
	//   client.to(dto.roomName).emit('typing', { username, typing });
	// }

	//Classic

	@SubscribeMessage('getChatRoomData')
	async getChatRoomData(@ConnectedSocket() client: Socket, @MessageBody('roomId') roomId: number) {
		const user = await this.socketService.getUser(client.id);
		const data: ChatRoomData = await this.messagesService.getChatRoomData(roomId, user.id);
		return data;
	}

	@SubscribeMessage('quitRoom')
	async quitRoom(
	@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket) {
	try {
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomById(roomId);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		this.messagesService.removeWhitelistUser(room.id, user.id);
		this.server.to(room.id.toString()).emit('refreshWhiteList', user, true);

	} catch (e) {
			client.emit('msgError', { message: e.message });
		}
}

	@SubscribeMessage('protectRoom')
	async protectRoom(@MessageBody('roomId') roomId: number,
	@MessageBody('password') password: string,
	@ConnectedSocket() client: Socket) {
	try {
			const user = this.socketService.getUser(client.id);
			const room = await this.messagesService.getRoomById(roomId);
			if (!room)
				throw new ForbiddenException('Room does not exist');
			const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
			if (!verifyClient)
				throw new ForbiddenException('User is not an admin');	
			await this.messagesService.protectRoom(roomId, password);
			this.server.to(room.id.toString()).emit('refreshType', 'protected');
	} catch (e) {
			client.emit('msgError', { message: e.message });
		}
	}
	@SubscribeMessage('unprotectRoom')
	async unprotectRoom(@MessageBody('roomId') roomId: number,
	@ConnectedSocket() client: Socket) {
	try {
			const user = this.socketService.getUser(client.id);
			const room = await this.messagesService.getRoomById(roomId);
			if (!room)
				throw new ForbiddenException('Room does not exist');
			const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
			if (!verifyClient)
				throw new ForbiddenException('User is not an admin');	
			await this.messagesService.unprotectRoom(roomId);
			this.server.to(room.id.toString()).emit('refreshType', 'public');
	} catch (e) {
			client.emit('msgError', { message: e.message });
		}
	}

}
