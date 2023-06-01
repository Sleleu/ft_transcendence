import { WebSocketGateway, OnGatewayInit, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { FriendService } from 'src/friend/friend.service';
import { MessageService } from './message.service';

@WebSocketGateway({ cors: true })
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: SocketsService,
    private readonly msg: MessageService,
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
        console.log('Client connected:', client.id, ' ->', user.username);
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
}
