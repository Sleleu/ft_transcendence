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
import { session } from 'passport';

@WebSocketGateway({ cors: true })
export class SocketsGameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;
	// private connectedClients: (Socket<any> | undefined)[] = [];
	private interval: NodeJS.Timeout | undefined;
	// private currentGameSpeed: number;
	private gameSessions: Map<(Socket<any> | undefined)[], GameService> = new Map();

	constructor(
		private readonly socketService: SocketsService,
		private readonly gameService: GameService,
		private readonly prismaService: PrismaService
		) {}

	afterInit() {
	}

	handleConnection(client: Socket) {
	}

	handleDisconnect(client: Socket) {
	}

	startGameInterval(clients: (Socket<any> | undefined)[]): void {
		let game_service = this.getGameService(clients);
		let connectedClients = clients;
		if (!game_service){
			console.log("no active game session!")
			return;
		}
		const intervalDuration = 500 / game_service.getGameState().gameSpeed;

		this.interval = setInterval(() => {
		if (game_service?.getwinner() && connectedClients[1] && connectedClients[0])
		{
			const player2 = this.socketService.getUser(connectedClients[1]?.id);
			const player1 = this.socketService.getUser(connectedClients[0]?.id);
			if (game_service.getGameState().playerScore > game_service.getGameState().opponentScore){
				player1.win++;
				player2.loose++;
			} else if (game_service.getGameState().playerScore < game_service.getGameState().opponentScore){
				player1.loose++;
				player2.win++;
			}
			connectedClients.forEach((client)=> {
				if (client)
				{
					client.emit('game-over', game_service?.getGameState());
					this.gameOver(client);
				}
			});
		}
		else if (connectedClients.length === 2  && !game_service?.getGameState().pause)
		{
			game_service?.bounceBall();
			connectedClients.forEach((client)=> {
				if (client)
					client.emit('updateBallPosition', game_service?.getGameState());
			});}
		}, intervalDuration);
	}

	stopGameInterval(): void {
		if (this.interval) {
		  clearInterval(this.interval);
		  this.interval = undefined;
		}
	}

	getGameService(clients: (Socket<any> | undefined)[]): GameService | undefined {
		for (const [key, gameService] of this.gameSessions.entries()) {
		  if (
			(key[0] === clients[0] && key[1] === clients[1]) ||
			(key[0] === clients[1] && key[1] === clients[0])
		  ) {
			return gameService;
		  }
		}
		return undefined;
	}

	find_clients(client1: (Socket<any> | undefined), client2: (Socket<any> | undefined)): boolean{
		for (const key of this.gameSessions.keys()) {
			if ((key[0] === client1 && key[1] === client2) ||
			(key[0] === client2 && key[1] === client1))
				return true;
		}
		return false;
	}

	//false if they didnt exist
	find_session(client1: (Socket<any> | undefined), client2: (Socket<any> | undefined)): boolean{

		if (!this.find_clients(client1, client2))
		{
			console.log("creating the game service")
			const game_service = new GameService;
			this.gameSessions.set([client1, client2], game_service);
			this.gameSessions.get([client1, client2])?.setnumofPlayers();
			return false;
		}
		return true;
	}

	deleteSession(clients: (Socket<any> | undefined)[]): boolean {
		for (const [key, _] of this.gameSessions.entries()) {
		  if (
			(key[0] === clients[0] && key[1] === clients[1]) ||
			(key[0] === clients[1] && key[1] === clients[0])
		  ) {
			this.gameSessions.delete(key);
			return true;
		  }
		}
		return false;
	  }

	@SubscribeMessage('join-room')
	joinroom(@MessageBody() gameMode: gameModeDto, @ConnectedSocket() client: Socket): void{

		//CREATING A NEW NODE TO THE GAME SESSION USING CLIENT AND THE OPPONENTID
		const opponent = this.socketService.findSocketById(+(gameMode.opponentid));
		if (opponent && (!this.find_session(client, this.server.sockets.sockets.get(opponent)))){
			let clients = [client, this.server.sockets.sockets.get(opponent)];
			let i = 0;
			console.log("didnt find the pair of clients created one");
			this.getGameService(clients)?.setSpeed(gameMode.Mode);
			for (const client of clients) {
				if (client)
					client.emit('start', ++i);
			}
			this.getGameService(clients)?.startGame();
			this.startGameInterval(clients);
		}
		else if (opponent && this.find_session(client, this.server.sockets.sockets.get(opponent))){
			console.log("session already exist");//for when the second player calls the session
		}
		else
			console.log("opponent doesnt exist");
	}

	@SubscribeMessage('game-over')
	gameOver(@ConnectedSocket() client: Socket): void{
		for (const connectedClients of this.gameSessions.keys()) {
		  if (connectedClients.includes(client)) {
			connectedClients.forEach((clients) => {
				clients?.emit("game-over");
			})
			this.getGameService(connectedClients)?.resetGame();
			this.stopGameInterval();
			this.deleteSession(connectedClients);
			break;
		  }
		}
	}

	@SubscribeMessage('join-as-spectator')
	joinAsSpectator(@MessageBody() playerId: number, @ConnectedSocket() client: Socket): void {
		let found = false;
		for (const [key, value] of this.gameSessions.entries()) {
			const [client1, client2] = key;
			if (client1 && client2 && (client1.id === playerId.toString() || client2.id === playerId.toString())) {
				client.emit('gameState', value.getGameState); // Spectator mode start signal
				this.startGameInterval(key)
				found = true;
				break;
			}
		}
		if (!found)
			console.log("no active game")
	}

	@SubscribeMessage('player-left')
	playerleft(@ConnectedSocket() client: Socket): void{
		for (const connectedClients of this.gameSessions.keys()) {
			if (connectedClients.includes(client)) {
				const leavingplayerind = connectedClients.indexOf(client);
				const opponentIndex = leavingplayerind === 0 ? 1 : 0;
				const game_serv = this.getGameService(connectedClients)
				if (game_serv)
				{
					game_serv.getGameState().playerScore = leavingplayerind === 0 ? 0 : 10;
					game_serv.getGameState().opponentScore = leavingplayerind === 0 ? 10 : 0;
					game_serv.resetGame();
					connectedClients[leavingplayerind]?.emit("player-left");
					connectedClients[opponentIndex]?.emit("game-over");
					this.stopGameInterval();
					this.deleteSession(connectedClients);
				}
			  break;
			}
		  }
	}

	@SubscribeMessage('move-player')
	movePlayer(@MessageBody() movePaddleDto: movePaddleDto, @ConnectedSocket() client: Socket): void{
		for (const connectedClients of this.gameSessions.keys()) {
			if (connectedClients.includes(client)) {
				const game_serv = this.getGameService(connectedClients);
				if (game_serv)
				{
					if (movePaddleDto.playerID === 1)
						game_serv.movePlayer1(movePaddleDto.movedPlayer);
					else
						game_serv.movePlayer2(movePaddleDto.movedPlayer);
					connectedClients.forEach((client)=> {
						if (client)
							client.emit('move-paddles', game_serv.getGameState());
					});
				}
				break;
			}
		  }


	}
}
