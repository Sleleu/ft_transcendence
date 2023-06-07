import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto, JoinRoomDto, RoomObj, TypingDto, UserDto } from './entities/message.entity';
import { ForbiddenException } from '@nestjs/common';
import { MessageService } from './message.service';
import { copyFileSync } from 'fs';

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
	findAllRooms() {
		const rooms = this.messagesService.findAllRooms();
		return rooms;
	}
	@SubscribeMessage('owner')
	async owner(@MessageBody('roomName') roomName: string,) {
		const owner = await this.messagesService.owner(roomName);
		if (!owner)
			throw new ForbiddenException('No owner found');
		return owner;
	}
	@SubscribeMessage('createRoom')
	async createRoom(@MessageBody() dto: CreateRoomDto,
	@ConnectedSocket() client: Socket) {
		const user = this.socketService.getUser(client.id);
		const exists = await this.messagesService.getRoomByName(dto.name);
		if (exists)
			throw new ForbiddenException('Room alerady exists');
		const room = await this.messagesService.createRoom(dto, user.id);
		this.messagesService.addWhitelistUser(room.id, user.id);
		this.messagesService.promoteAdmin(room.id, user.id);
		this.server.emit('newRoom', room);
		return room;
	}
	@SubscribeMessage('join')
	async joinRoom(@MessageBody() dto:JoinRoomDto, @ConnectedSocket() client: Socket) {
		try {
		const room = await this.messagesService.getRoomByName(dto.roomName);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const user = this.socketService.getUser(client.id);
		const banned = await this.messagesService.isBanned(room.id, user.id)
		if (banned)
			throw new ForbiddenException('Access to room forbidden : user banned');
		if (room.type === 'private')
		{
		  const whitelisted = this.messagesService.searchWhiteList(room.id, user.id)
		  if (!whitelisted)
			throw new ForbiddenException('Access to private room forbidden');
		}
		if (room.type === 'protected')
		{
		  if (!dto.password || dto.password !== room.password)
			throw new ForbiddenException('Wrong password provided');
		}
		client.join(dto.roomName);
		console.log(user.username, 'joined room :', dto.roomName);
		if (room.type === 'protected' || room.type === 'public')
		{
			const whitelisted = await this.messagesService.searchWhiteList(room.id, user.id)
			if (!whitelisted)
				this.messagesService.addWhitelistUser(room.id, user.id);
		}
		this.messagesService.connectedUser(room.id, user.id);
		client.emit('joinSuccess', {id: room.id, roomName: room.name});
	} catch (e) {
		client.emit('joinError', { message: e.message });
	}
	}

	@SubscribeMessage('leave')
	async leaveRoom(@MessageBody() joinDto: JoinRoomDto, @ConnectedSocket() client: Socket) {
	  client.leave(joinDto.roomName);
	  const user = this.socketService.getUser(client.id);
	  const room = await this.messagesService.getRoomByName(joinDto.roomName);
	  if (!room)
		throw new ForbiddenException('No room found');
	  this.messagesService.disconnectedUser(room.id, user.id);
	//   console.log(joinDto.name, 'left room :', joinDto.roomName);
	}


	@SubscribeMessage('findRoomMessages')
	findRoom(@MessageBody('id') id: number) {
	  const messages = this.messagesService.getMessagesByRoom(id);
	  return messages;
	}
	@SubscribeMessage('createMessage')
	async create(@MessageBody() dto: CreateMessageDto,
	  @ConnectedSocket() client: Socket) {
	  const user = this.socketService.getUser(client.id);
	  const room = await this.messagesService.getRoomByName(dto.roomName);
	  if (!room)
		  throw new ForbiddenException('Room does not exist');
	  const banned = await this.messagesService.isBanned(room.id, user.id);
	  if (banned)
	  	throw new ForbiddenException('Client is banned');
	  const message = await this.messagesService.createMessage(dto, user.username);
	  this.server.to(dto.roomName).emit('message', message);

	  return message;
	}

	@SubscribeMessage('promoteAdmin')
	async promoteAdmin(@MessageBody('target') target: string,
	@MessageBody('roomName') roomName: string,
	@ConnectedSocket() client: Socket)
	{
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomByName(roomName);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const userTarget = await this.messagesService.searchUser(target);
		if (!userTarget)
			throw new ForbiddenException('Target does not exist');
		const targetIsBanned = await this.messagesService.isBanned(room.id, userTarget.id);
		if (targetIsBanned)
			throw new ForbiddenException('Cannot promote a banned user');
		const aleradyAdmin = await this.messagesService.isAdmin(room.id, userTarget.id);
		if (aleradyAdmin)
			throw new ForbiddenException('User is alerady an admin');
		this.messagesService.promoteAdmin(room.id, userTarget.id);
	}
	@SubscribeMessage('demoteAdmin')
	async demoteAdmin(@MessageBody('target') target: string,
	@MessageBody('roomName') roomName: string,
	@ConnectedSocket() client: Socket)
	{
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomByName(roomName);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const userTarget = await this.messagesService.searchUser(target);
		if (!userTarget)
			throw new ForbiddenException('Target does not exist');

		const wasAdmin = this.messagesService.isAdmin(room.id, userTarget.id);
		if (!wasAdmin)
			throw new ForbiddenException('User is not an admin');
		this.messagesService.demoteAdmin(room.id, userTarget.id);
	}
	@SubscribeMessage('ban')
	async ban(@MessageBody('target') target: string,
	@MessageBody('roomName') roomName: string,
	@ConnectedSocket() client: Socket)
	{
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomByName(roomName);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const userTarget = await this.messagesService.searchUser(target);
		if (!userTarget)
			throw new ForbiddenException('Target does not exist');
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
	}
	@SubscribeMessage('unban')
	async unban(@MessageBody('target') target: string,
	@MessageBody('roomName') roomName: string,
	@ConnectedSocket() client: Socket)
	{
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomByName(roomName);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const userTarget = await this.messagesService.searchUser(target);
		if (!userTarget)
			throw new ForbiddenException('Target does not exist');
		const targetIsBanned = await this.messagesService.isBanned(room.id, userTarget.id);
		if (!targetIsBanned)
			throw new ForbiddenException('Target is not Banned');
		this.messagesService.unban(room.id, userTarget.id);
	}

	@SubscribeMessage('kick')
	async kick(@MessageBody('targetId') targetId: number,
	@MessageBody('roomName') roomName: string,
	@ConnectedSocket() client: Socket)
	{
		const user = this.socketService.getUser(client.id);
		const room = await this.messagesService.getRoomByName(roomName);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const verifyClient = await this.messagesService.isAdmin(room.id, user.id);
		if (!verifyClient)
			throw new ForbiddenException('Client is not an admin');
		const kickedId = this.socketService.findSocketById(targetId);
		if (!kickedId)
			throw new ForbiddenException('Invalid target client ID');
		const kickedClient = this.server.sockets.sockets.get(kickedId);
		if (!kickedClient)
			throw new ForbiddenException('Invalid target');
		const isConnected = await this.messagesService.isConnected(room.id, targetId);
		if (isConnected)
			kickedClient.emit('kickUser', {name: room.name});
	}


	@SubscribeMessage('getWhitelist')
	async getWhitelist(@MessageBody('roomName') roomName: string,
	@ConnectedSocket() client: Socket) {
		const room = await this.messagesService.getRoomByName(roomName);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const users = await this.messagesService.getWhiteList(room.id);
		if (!users)
			throw new ForbiddenException('No users in this room');
		this.server.to(roomName).emit('whitelist', users);
	}

	//Ne fonctionne plus pour le moment
	@SubscribeMessage('typing')
	async typing(@MessageBody() dto: TypingDto, @ConnectedSocket() client: Socket) {
	  const user = await this.socketService.getUser(client.id);
	  const username = user.username;
	  const typing = dto.isTyping;
	  client.to(dto.roomName).emit('typing', { username, typing });
	}
}
