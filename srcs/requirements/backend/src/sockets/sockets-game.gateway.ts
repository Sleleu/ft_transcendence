import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { GameState, BounceBallDto } from './dto/game.dto';
import { Interval } from '@nestjs/schedule';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class SocketsGameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;
	private connectedClients: Socket[] = [];

	constructor(
		private readonly socketService: SocketsService,
		private readonly gameService: GameService //<--- Your Service class
		) {}

    afterInit() {
		console.log('WebSocket Gateway initialized');
	  }

	  handleConnection(client: Socket) {
		console.log('Client connected:', client.id);
		// this.joinroom(client);
	  }

	  handleDisconnect(client: Socket) {
		console.log('Client disconnected:', client.id);
		this.connectedClients = this.connectedClients.filter((c) => c.id !== client.id);
	}

	@Interval(500)
	updateGameStateInterval(): void{
		// if (this.connectedClients.length === 2 && !this.gameService.getGameState().pause)
		if (this.gameService.getwinner())
			this.server.emit("game-over");
		else if (!this.gameService.getGameState().pause)
		{
			// console.log("inside the interval on the server side");
			this.gameService.bounceBall();
			this.server.emit("updateBallPosition", this.gameService.getGameState());
		}

	}

	//create an event for player-joining and set the sockets , the event takes the user id
	@SubscribeMessage('join-room')
	joinroom(@ConnectedSocket() client: Socket): void{
		console.log("server side: joining a room: ", this.connectedClients[0]);
		if (this.connectedClients.length < 2)
			this.connectedClients.push(client);

		if (this.connectedClients.length === 2){
			this.server.emit('start');
			console.log("server: starting the game");
		}
		else
			console.log("server:waiting for the second player");
	}

	@SubscribeMessage('start')
	startGame(@ConnectedSocket() client: Socket): void{
	  console.log("in socketgatway start game")
	  this.gameService.startGame();
	  this.server.emit('start');
	}

	@SubscribeMessage('pause')
	pauseGame(@ConnectedSocket() client: Socket): void{
	  console.log("in socketgatway pause game")
	  this.gameService.pauseGame();
	  this.server.emit('pause');
	}

	@SubscribeMessage('reset')
	resetGame(@ConnectedSocket() client: Socket): void{
	  console.log("in socketgatway reset game")
	  this.gameService.resetGame();
	  this.server.emit('reset');
	}

	@SubscribeMessage('updateBallPosition')
	bounceBall(@MessageBody() bounceBallDto: BounceBallDto,  @ConnectedSocket() client: Socket): void{
	  this.gameService.updateBallPosition(bounceBallDto);
	  console.log("server side: bounce ball gateway emitting from: ", client.id);
	  this.server.emit('updateBallPosition', this.gameService.getGameState());
	}

	@SubscribeMessage('move-player')
	  movePlayer(@MessageBody() movePlayer: number[], @ConnectedSocket() client: Socket): void{
		// console.log("server side: move-player");
	  this.gameService.movePlayer(movePlayer);
	  client.broadcast.emit('move-opponent', this.gameService.getGameState());
	}

	// @SubscribeMessage('move-opponent')
	  // moveOpponent(@MessageBody() moveOpponent: number[], @ConnectedSocket() client: Socket): void{
	  // 	this.messagesService.moveOpponent(moveOpponent);
	//   this.server.emit('move-opponent', this.messagesService.getGameState());
	// }

	// @SubscribeMessage('score')
	// score(@ConnectedSocket() client: Socket): void{
	//   console.log("server side: score event");
	//   this.messagesService.getGameState().playerScore++;
	//   client.emit('score', this.messagesService.getGameState());
	// }


}
