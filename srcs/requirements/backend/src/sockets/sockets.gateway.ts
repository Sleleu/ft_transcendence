import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guard';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, UseGuards, Req, Post, Param, Put, Delete } from "@nestjs/common";
import { Request } from 'express';

interface reqUser {
  id: number
}

interface newReq extends Request {
  user: reqUser
}

@UseGuards(JwtGuard)
@WebSocketGateway({ cors: true })
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: SocketsService) { }

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('getFriend')
  async getFriendsByUserId(@Req() req: newReq) {
    const friends = await this.messagesService.getFriendsByUserId(+req.user.id);
    return friends;
  }

  @SubscribeMessage('getFriendReq')
  async getFriendReq(@Req() req: newReq) {
    return this.messagesService.getFriendReq(+req.user.id)
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    console.log("Message Received by server : ", createMessageDto);
    const message = await this.messagesService.create(createMessageDto);

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    const messages = this.messagesService.findAll();
    return messages;
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket) {
    const name = await this.messagesService.getClientName(client.id);
    client.broadcast.emit('typing', { name, isTyping });
  }

}

// @SubscribeMessage('updateMessage')
// update(@MessageBody() updateMessageDto: UpdateMessageDto) {
//   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
// }
// @SubscribeMessage('removeMessage')
// remove(@MessageBody() id: number) {
//   return this.messagesService.remove(id);
// }
// @SubscribeMessage('findOneMessage')
// findOne(@MessageBody() id: number) {
//   return this.messagesService.findOne(id);
// }
