import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto, JoinRoomDto, RoomObj, TypingDto, UserDto } from './entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { Cipher } from 'crypto';
import { User } from '@prisma/client';
import { FriendService } from 'src/friend/friend.service';
import { ForbiddenException } from '@nestjs/common';
import { SocketsChatGateway } from './sockets-message.gateway';

@WebSocketGateway({ cors: true })
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: SocketsService,
    private jwtService: JwtService,
    private friendService: FriendService) {}

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
        console.log('Client connected:', client.id);
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
    this.messagesService.supClient(client.id)
  }



  //FRIEND
  @SubscribeMessage('getFriend')
  async getFriendsByUserId(@ConnectedSocket() client: Socket) {
    const user = this.messagesService.getUser(client.id);
    const friends = await this.friendService.getFriendsByUserId(user.id);
    return friends;
  }

  @SubscribeMessage('getFriendReq')
  async getFriendReq(@ConnectedSocket() client: Socket) {
    const user = this.messagesService.getUser(client.id);
    return this.friendService.getFriendReq(user.id)
  }

  @SubscribeMessage('send')
  async sendFriendReq(@ConnectedSocket() client: Socket, @MessageBody() body: { id: number }) {
    const user = this.messagesService.getUser(client.id);
    const request = await this.friendService.createFriendRequest(user.id, +body.id)
    const friendSocketId = this.messagesService.findSocketById(+body.id)
    if (friendSocketId) {
      const friendSocket = this.server.sockets.sockets.get(friendSocketId)
      if (friendSocket) {
        console.log("emit to", friendSocketId, "\nreq: ", request)
        friendSocket.emit('friendRequestNotification', { req : request });
      }
    }
  }

}
