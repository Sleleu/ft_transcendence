import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {Server, Socket} from 'socket.io';
import { CreateRoomDto, JoinRoomDto, RoomObj, TypingDto } from './entities/message.entity';


@WebSocketGateway({cors : true})
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: SocketsService) {}

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // CHAT
  @SubscribeMessage('createRoom')
  async createRoom(@MessageBody() dto: CreateRoomDto) {
    const room = await this.messagesService.createRoom(dto);
    return room;
  }
  @SubscribeMessage('findAllRooms')
    findAllRooms() {
    const rooms = this.messagesService.findAllRooms();
    return rooms;
  }
  @SubscribeMessage('addWhiteList')
  async addWhiteList(@MessageBody('roomId') roomId: number, @MessageBody('userId') userId: number) {
    const room = await this.messagesService.addWhitelistUser(roomId, userId);
    return room;
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.createMessage(createMessageDto);
    this.server.to(createMessageDto.roomName).emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
    findAll() {
    const messages = this.messagesService.findAll();
    return messages;
  }

  @SubscribeMessage('findRoomMessages')
    findRoom(@MessageBody('roomId') roomId: number,) {
    const messages = this.messagesService.getMessagesByRoom(roomId);
    return messages;
  }

  @SubscribeMessage('connectToChat')
  connect(@MessageBody() name: string, @ConnectedSocket() client: Socket)
  {
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody() joinDto:JoinRoomDto, @ConnectedSocket() client: Socket) {
    //Check le type de la room
    //Si la room est privée : user sur la whitelist ?
    //Si la room est protected : password valide ?
    client.join(joinDto.roomName);
    console.log(joinDto.name, 'joined room :', joinDto.roomName);
  }

  @SubscribeMessage('leave')
  leaveRoom(@MessageBody() joinDto:JoinRoomDto, @ConnectedSocket() client: Socket) {
    client.leave(joinDto.roomName);
    console.log(joinDto.name, 'left room :', joinDto.roomName);
  }

  //Ne fonctionne plus pour le moment
  @SubscribeMessage('typing')
  async typing(@MessageBody() dto: TypingDto, @ConnectedSocket() client: Socket) {
    const name = await this.messagesService.getClientName(client.id);
    const typing = dto.isTyping;
    client.to(dto.roomName).emit('typing', { name, typing }); 
  }

}
