import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto, JoinRoomDto, RoomObj, TypingDto, UserDto } from './entities/message.entity';
import { ForbiddenException } from '@nestjs/common';
import { MessageService } from './message.service';

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
		console.log(room);
		return room;
	}
	@SubscribeMessage('join')
	async joinRoom(@MessageBody() dto:JoinRoomDto, @ConnectedSocket() client: Socket) {
		const room = await this.messagesService.getRoomByName(dto.roomName);
		if (!room)
			throw new ForbiddenException('Room does not exist');
		const user = this.socketService.getUser(client.id);
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
	}
	@SubscribeMessage('leave')
	leaveRoom(@MessageBody() joinDto: JoinRoomDto, @ConnectedSocket() client: Socket) {
	  client.leave(joinDto.roomName);
	  console.log(joinDto.name, 'left room :', joinDto.roomName);
	}


	@SubscribeMessage('findRoomMessages')
	findRoom(@MessageBody('roomId') roomId: number,) {
	  const messages = this.messagesService.getMessagesByRoom(roomId);
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

	//Ne fonctionne plus pour le moment
	@SubscribeMessage('typing')
	async typing(@MessageBody() dto: TypingDto, @ConnectedSocket() client: Socket) {
	  const user = await this.socketService.getUser(client.id);
	  const username = user.username;
	  const typing = dto.isTyping;
	  client.to(dto.roomName).emit('typing', { username, typing });
	}
}
