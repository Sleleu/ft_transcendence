import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {Server, Socket} from 'socket.io';
import { CreateRoomDto, JoinRoomDto, RoomObj, TypingDto, UserDto } from './entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { Cipher } from 'crypto';
import { User } from '@prisma/client';

@WebSocketGateway({cors: true})
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: SocketsService,
    private jwtService: JwtService) {}

  // INIT ----------------------------------------
  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.cookie?.substring(14);
      if (token) {
        const payload = this.jwtService.verify(token);
        const user = await this.messagesService.getUserWithToken(token);
        this.messagesService.identify(user, client.id);
        console.log('Client connected:', user);
      }
      else {
        console.log('CONNECTION ERROR : token is undefined');
        client.disconnect();
      }
    }
    catch (e) {
      console.log('CONNECTION ERROR : ', e);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // CHAT -------------------------------------------

  // @SubscribeMessage('addWhiteList')
  // async addWhiteList(@MessageBody('roomId') roomId: number, @MessageBody('userId') userId: number) {
    //   const room = await this.messagesService.addWhitelistUser(roomId, userId);
    //   return room;
    // }
  // @SubscribeMessage('connectToChat')
  // connect(@MessageBody() name: string, @ConnectedSocket() client: Socket)
  // {
  //   return this.messagesService.identify(name, client.id);
  // }

  @SubscribeMessage('createRoom')
  async createRoom(@MessageBody() dto: CreateRoomDto,
   @ConnectedSocket() client: Socket) {
    const user = this.messagesService.getUser(client.id);
    const room = await this.messagesService.createRoom(dto, user.id);
    this.messagesService.addWhitelistUser(room.id, user.id);
    console.log(room);
    return room;
  }

  @SubscribeMessage('findAllRooms')
    findAllRooms() {
    const rooms = this.messagesService.findAllRooms();
    return rooms;
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto,
  @ConnectedSocket() client: Socket) {
    const user = this.messagesService.getUser(client.id);
    const message = await this.messagesService.createMessage(createMessageDto, user.username);
    this.server.to(createMessageDto.roomName).emit('message', message);

    return message;
  }

  @SubscribeMessage('findRoomMessages')
    findRoom(@MessageBody('roomId') roomId: number,) {
    const messages = this.messagesService.getMessagesByRoom(roomId);
    return messages;
  }

  @SubscribeMessage('join')
  async joinRoom(@MessageBody() dto:JoinRoomDto, @ConnectedSocket() client: Socket) {
    try {
      const room = await this.messagesService.getRoomByName(dto.roomName);
      const user = this.messagesService.getUser(client.id);
      console.log('ROOM\n', room);
      console.log('USER\n', user);
      if (room.type === 'private')
      {
        const whitelisted = this.messagesService.searchWhiteList(room.id, user.id)
        if (!whitelisted)
          throw 'ROOM ACCESS FORBIDDEN';
      }
      client.join(dto.roomName);
      console.log(user.username, 'joined room :', dto.roomName);
    }
    catch(e) {
      console.log(e);
    }
  }

  @SubscribeMessage('leave')
  leaveRoom(@MessageBody() joinDto:JoinRoomDto, @ConnectedSocket() client: Socket) {
    client.leave(joinDto.roomName);
    console.log(joinDto.name, 'left room :', joinDto.roomName);
  }

  //Ne fonctionne plus pour le moment
  @SubscribeMessage('typing')
  async typing(@MessageBody() dto: TypingDto, @ConnectedSocket() client: Socket) {
    const user = await this.messagesService.getUser(client.id);
    const username = user.username;
    const typing = dto.isTyping;
    client.to(dto.roomName).emit('typing', { username, typing });
  }

}
