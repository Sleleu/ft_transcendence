import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { GameState, BounceBallDto, movePaddleDto} from './dto/game.dto';
import { Interval } from '@nestjs/schedule';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class SocketsGameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;
	private connectedClients: Socket[] = [];

	constructor(
		private readonly socketService: SocketsService,
		private readonly gameService: GameService
		) {}

	afterInit() {
		console.log('WebSocket Gateway initialized');
	}

	handleConnection(client: Socket) {
		console.log('in game connection:', client.id);
		// this.joinroom(client);
	}

	handleDisconnect(client: Socket) {
		console.log('game disconnected:', client.id);
	}

	@Interval(500)
	updateGameStateInterval(): void{
		if (this.gameService.getwinner())
		{
			console.log("inside the interval game over");

			//update prisma data
			this.connectedClients.forEach((client)=> {
				client.emit('game-over', this.gameService.getGameState());
				this.gameOver(client);
			});
		}
		else if (this.connectedClients.length === 2  && !this.gameService.getGameState().pause)
		{
			console.log("inside the interval bounce ball with ", this.connectedClients.length, " clients");
			this.gameService.bounceBall();
			this.server.emit("updateBallPosition", this.gameService.getGameState());
		}
	}

	//create an event for player-joining and set the sockets , the event takes the user id
	@SubscribeMessage('join-room')
	joinroom(@ConnectedSocket() client: Socket): void{
		console.log("server side: joining a room: ");
		if (this.connectedClients.length < 2)
		{
			console.log("adding user to the game room: ");
			this.connectedClients.push(client);
		}
		else if (this.connectedClients.length > 2)
		{
			console.log("more than two users not allowed");
		}
		if (this.connectedClients.length === 2){
			let i = 0;
			this.connectedClients.forEach((client)=> {
				client.emit('start', ++i);
				this.startGame(client);
			});
			console.log("server: starting the game: ");
		}
		else
			console.log("server:waiting for the second player");
	}

	@SubscribeMessage('start')
	startGame(@ConnectedSocket() client: Socket): void{
		console.log("in socketgatway start game");
		this.gameService.startGame();

		// this.connectedClients.forEach((client)=> {
		// 	client.emit('start');
		// });
	}

	@SubscribeMessage('pause')
	pauseGame(@ConnectedSocket() client: Socket): void{
		console.log("in socketgatway pause game");
		this.gameService.pauseGame();

		this.connectedClients.forEach((client)=> {
			client.emit('pause');
		});
	}

	// @SubscribeMessage('reset')
	// resetGame(@ConnectedSocket() client: Socket): void{
	// 	console.log("in socketgatway reset game")
	// 	this.gameService.resetGame();

	// 	this.connectedClients.forEach((client)=> {
	// 		client.emit('reset');
	// 	});
	// }

	@SubscribeMessage('game-over')
	gameOver(@ConnectedSocket() client: Socket): void{
		//update prisma data
		this.connectedClients.forEach((client)=> {
			client.emit("game-over");
		});
		this.gameService.resetGame();
		this.connectedClients = [];
	}

	@SubscribeMessage('updateBallPosition')
	bounceBall(@MessageBody() bounceBallDto: BounceBallDto,  @ConnectedSocket() client: Socket): void{
		this.gameService.updateBallPosition(bounceBallDto);
		console.log("server side: bounce ball gateway emitting from: ", client.id);

		this.connectedClients.forEach((client)=> {
			client.emit('updateBallPosition', this.gameService.getGameState());
		});
	}

	@SubscribeMessage('move-player')
	movePlayer(@MessageBody() movePaddleDto: movePaddleDto, @ConnectedSocket() client: Socket): void{
		// console.log("server side: move-player with id: ", movePaddleDto.playerID, "and moved player of ", movePaddleDto.movedPlayer);
		if (movePaddleDto.playerID === 1)
			this.gameService.movePlayer1(movePaddleDto.movedPlayer);
		else
			this.gameService.movePlayer2(movePaddleDto.movedPlayer);

		this.connectedClients.forEach((client)=> {
			client.emit('move-paddles', this.gameService.getGameState());
		});
	}
}
