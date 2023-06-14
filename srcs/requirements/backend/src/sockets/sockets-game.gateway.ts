import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { BounceBallDto, movePaddleDto, gameModeDto} from './dto/game.dto';
import { Interval } from '@nestjs/schedule';
import { GameService } from './game.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { profile } from 'console';
import { connect } from 'http2';

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
		// console.log('WebSocket Gateway initialized');
	}

	handleConnection(client: Socket) {
		// console.log('in game connection:', client.id);
	}

	handleDisconnect(client: Socket) {
		// console.log('game disconnected:', client.id);
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

	@SubscribeMessage('join-room')
	joinroom(@MessageBody() gameMode: gameModeDto, @ConnectedSocket() client: Socket): void{
		if (this.gameService.getGameState().numofPlayers === 2)
			return ;
		this.connectedClients[0] = client;
		const opponent = this.socketService.findSocketById(+(gameMode.opponentid));
		if (opponent)
			this.connectedClients[1] = this.server.sockets.sockets.get(opponent);

		if (this.connectedClients.length === 2){
			this.gameService.setnumofPlayers();
			let i = 0;
			if ( gameMode.Mode === 'n')
				this.currentGameSpeed = 500;
			else
				this.currentGameSpeed = 100;
			this.connectedClients.forEach((client)=> {
				if (client)
					client.emit('start', ++i);
			});
			this.gameService.startGame();
			this.startGameInterval();
		}
	}

	@SubscribeMessage('game-over')
	gameOver(@ConnectedSocket() client: Socket): void{
		if (this.connectedClients.includes(client))
		{
			this.connectedClients.forEach((connectedclient)=> {
				console.log("server side sending game-over")
				if (connectedclient)
					client.emit("game-over");
			});
			this.gameService.resetGame();
			this.stopGameInterval();
			this.connectedClients = [];
		}
	}

	@SubscribeMessage('player-left')
	playerleft(@ConnectedSocket() client: Socket): void{
		if (this.connectedClients.includes(client))
		{
			console.log("calling player-left")
			const leavingplayerind = this.connectedClients.indexOf(client);
			const opponentIndex = leavingplayerind === 0 ? 1 : 0;

			this.gameService.getGameState().playerScore = leavingplayerind === 0 ? 0 : 10;
			this.gameService.getGameState().opponentScore = leavingplayerind === 0 ? 10 : 0;
			this.connectedClients[leavingplayerind]?.emit("player-left");
			this.connectedClients[opponentIndex]?.emit("game-over");

			this.gameService.resetGame();
			this.stopGameInterval();
			this.connectedClients = [];
		}
	}

	@SubscribeMessage('move-player')
	movePlayer(@MessageBody() movePaddleDto: movePaddleDto, @ConnectedSocket() client: Socket): void{
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
