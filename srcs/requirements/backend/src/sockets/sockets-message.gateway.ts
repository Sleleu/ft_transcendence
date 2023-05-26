import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto, JoinRoomDto, RoomObj, TypingDto, UserDto } from './entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { Cipher } from 'crypto';
import { User } from '@prisma/client';
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
		console.log('Client connected:', client.id);
	  }

	  handleDisconnect(client: Socket) {
		console.log('Client disconnected:', client.id);
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
	async create(@MessageBody() createMessageDto: CreateMessageDto,
	  @ConnectedSocket() client: Socket) {
	  const user = this.socketService.getUser(client.id);
	  const message = await this.messagesService.createMessage(createMessageDto, user.username);
	  this.server.to(createMessageDto.roomName).emit('message', message);

	  return message;
	}

	@SubscribeMessage('promoteAdmin')
	async promoteAdmin(@MessageBody('targetId') targetId: number,
	@ConnectedSocket() client: Socket)
	{
		//client is admin
		//target is a user, not banned and not alerady an admin
		// promote user
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
