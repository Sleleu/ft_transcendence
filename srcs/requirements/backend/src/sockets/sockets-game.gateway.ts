import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { BounceBallDto, movePaddleDto, gameModeDto} from './dto/game.dto';
import { Interval } from '@nestjs/schedule';
import { GameService } from './game.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { profile } from 'console';

@WebSocketGateway({ cors: true })
export class SocketsGameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;
	private connectedClients: (Socket<any> | undefined)[] = [];
	private interval: NodeJS.Timeout | undefined;
	private currentGameSpeed: number;

	constructor(
		private readonly socketService: SocketsService,
		private readonly gameService: GameService,
		private readonly prismaService: PrismaService
		) {}

	afterInit() {
		console.log('WebSocket Gateway initialized');
	}

	handleConnection(client: Socket) {
		console.log('in game connection:', client.id);
	}

	handleDisconnect(client: Socket) {
		console.log('game disconnected:', client.id);
	}

	startGameInterval(): void {
		const intervalDuration = this.currentGameSpeed;
		this.interval = setInterval(() => {
		if (this.gameService.getwinner() && this.connectedClients[1] && this.connectedClients[0])
		{
			const player2 = this.socketService.getUser(this.connectedClients[1]?.id);
			const player1 = this.socketService.getUser(this.connectedClients[0]?.id);
			if (this.gameService.getGameState().playerScore > this.gameService.getGameState().opponentScore){
				player1.win++;
				player2.loose++;
			} else if (this.gameService.getGameState().playerScore < this.gameService.getGameState().opponentScore){
				player1.loose++;
				player2.win++;
			}
			this.connectedClients.forEach((client)=> {
				if (client)
				{
					client.emit('game-over', this.gameService.getGameState());
					this.gameOver(client);
				}
			});
		}
		else if (this.connectedClients.length === 2  && !this.gameService.getGameState().pause)
		{
			// console.log("inside the interval game over with speed of ", intervalDuration);
			this.gameService.bounceBall();
			this.connectedClients.forEach((client)=> {
				if (client)
					client.emit('updateBallPosition', this.gameService.getGameState());
			});}
		}, intervalDuration);
	}

	stopGameInterval(): void {
		if (this.interval) {
		  clearInterval(this.interval);
		  this.interval = undefined;
		}
	}

	@SubscribeMessage('join-room')//recieve another variable game mode
	joinroom(@MessageBody() gameMode: gameModeDto, @ConnectedSocket() client: Socket): void{
		console.log("server side: joining a room: ", gameMode.opponentid, gameMode.Mode);

		this.connectedClients[0] = client;
		const opponent = this.socketService.findSocketById(+(gameMode.opponentid));
		console.log("opponentid is ", gameMode.opponentid, opponent);
		if (opponent)
		{
			console.log("found the opponent");
			this.connectedClients[1] = this.server.sockets.sockets.get(opponent);
		}
		if (this.connectedClients.length === 2){
			let i = 0;
			if ( gameMode.Mode === 'n')
				this.currentGameSpeed = 700;
			else
				this.currentGameSpeed = 500;
			this.connectedClients.forEach((client)=> {
				if (client)
				{
					client.emit('start', ++i);
					this.startGame(client);
				}
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
		this.startGameInterval();
	}

	@SubscribeMessage('pause')
	pauseGame(@ConnectedSocket() client: Socket): void{
		console.log("in socketgatway pause game");
		this.gameService.pauseGame();

		this.connectedClients.forEach((client)=> {
			if (client)
				client.emit('pause');
		});
	}

	@SubscribeMessage('game-over')
	gameOver(@ConnectedSocket() client: Socket): void{
		this.connectedClients.forEach((client)=> {
			if (client)
				client.emit("game-over");
		});
		this.gameService.resetGame();
		this.stopGameInterval();
		this.connectedClients = [];
	}

	@SubscribeMessage('player-left')
	playerleft(@ConnectedSocket() client: Socket): void{
		if (client == this.connectedClients[0]){
			this.gameService.getGameState().playerScore = 0;
			this.gameService.getGameState().opponentScore = 10;
		}else{
			this.gameService.getGameState().playerScore = 10;
			this.gameService.getGameState().opponentScore = 0;
		}
		// console.log("in socketgatway playerleft");
		this.connectedClients.forEach((client)=> {
			if (client)
				client.emit("game-over");
		});
		this.gameService.resetGame();
		this.stopGameInterval();
		this.connectedClients = [];
	}

	@SubscribeMessage('updateBallPosition')
	bounceBall(@MessageBody() bounceBallDto: BounceBallDto,  @ConnectedSocket() client: Socket): void{
		this.gameService.updateBallPosition(bounceBallDto);
		console.log("server side: bounce ball gateway emitting from: ", client.id);

		this.connectedClients.forEach((client)=> {
			if (client)
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
			if (client)
				client.emit('move-paddles', this.gameService.getGameState());
		});
	}
}



	// @Interval(500)
	// updateGameStateInterval(): void{
	// 	if (this.gameService.getwinner() && this.connectedClients[1] && this.connectedClients[0])
	// 	{
	// 		const player2 = this.socketService.getUser(this.connectedClients[1]?.id);
	// 		const player1 = this.socketService.getUser(this.connectedClients[0]?.id);

	// 		if (this.gameService.getGameState().playerScore > this.gameService.getGameState().opponentScore){
	// 			player1.win++;
	// 			player2.loose++;
	// 		} else if (this.gameService.getGameState().playerScore < this.gameService.getGameState().opponentScore){
	// 			player1.loose++;
	// 			player2.win++;
	// 		}

	// 		this.connectedClients.forEach((client)=> {
	// 			if (client)
	// 			{
	// 				client.emit('game-over', this.gameService.getGameState());
	// 				this.gameOver(client);
	// 			}
	// 		});
	// 	}
	// 	else if (this.connectedClients.length === 2  && !this.gameService.getGameState().pause)
	// 	{
	// 		// console.log("inside the interval bounce ball with ", this.connectedClients.length, " clients");
	// 		this.gameService.bounceBall();
	// 		this.gameService.updateScores();
	// 		this.connectedClients.forEach((client)=> {
	// 			if (client)
	// 				client.emit('updateBallPosition', this.gameService.getGameState());
	// 		});
	// 	}
	// }
