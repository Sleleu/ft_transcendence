import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: true })
export class SocketsGameGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
		// private readonly gameService: GameService <--- Your Service class
        ) {}
}
