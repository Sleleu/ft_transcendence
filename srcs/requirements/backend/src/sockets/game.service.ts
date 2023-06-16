import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameState, BounceBallDto} from './dto/game.dto';
import { Server, Socket } from 'socket.io';

const PADDLE_BOARD_SIZE = 3;
const PADDLE_EDGE_SPACE = 1;

const ROW_SIZE = 10;
const COL_SIZE = 20;

const board = [...Array(PADDLE_BOARD_SIZE)].map((_, pos) => pos);

@Injectable()
export class GameService {
	private spectators: Socket<any>[] = [];
	private gameState: GameState = {
		player1: board.map((x) => x * COL_SIZE + PADDLE_EDGE_SPACE),
		player2: board.map((x) => (x + 1) * COL_SIZE - (PADDLE_EDGE_SPACE + 1)),
		ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE, // Initial ball position
		deltaX: -1, // Initial ball delta x
		deltaY: -(COL_SIZE), // Initial ball delta y
		playerScore: 0, // Initial player score
		opponentScore: 0, // Initial opponent score
		pause: true, // Initial game state (paused)
		numofPlayers: 0,
		gameSpeed: 0,
	};

	addSpectator(spectator: Socket<any>): void {
		this.spectators.push(spectator);
	}

	removeSpectator(spectator: Socket<any>): void {
		const index = this.spectators.indexOf(spectator);
		if (index !== -1) {
		  this.spectators.splice(index, 1);
		}
	}

	spectatorGameEnded(): void {
		this.spectators.forEach((spectator) => {
			spectator.emit('game-over');
		  });
	}

	updateSpectators(gameState: GameState): void {
		this.spectators.forEach((spectator) => {
		  spectator.emit('gameState', gameState); // Emit game state update to spectators
		});
	}

	getGameState() : GameState{
	// console.log("server service: gameState");
		return this.gameState;
	}

	startGame(): void {
		this.gameState.pause = false;
		console.log("server service: startGame");
	}

	pauseGame(): void {
		this.gameState.pause = true;
		console.log("server service: pauseGame");
	}

	resetGame(): void{
		// console.log("server service: resetGame");
		this.gameState = {
			player1: board.map((x) => x * COL_SIZE + PADDLE_EDGE_SPACE), // Reset player board
			player2: board.map((x) => (x + 1) * COL_SIZE - (PADDLE_EDGE_SPACE + 1)), // Reset opponent board
			ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE, // Reset ball position
			deltaX: -1, // Reset ball delta x
			deltaY: -(COL_SIZE), // Reset ball delta y
			playerScore: 0, // Reset player score
			opponentScore: 0, // Reset opponent score
			pause: true, // Reset game state (paused)
			numofPlayers: 0,
			gameSpeed: 0,
		};
	}

	setSpeed(Mode: string): void{
		if (Mode === 'n')
			this.gameState.gameSpeed = 4;
		else
			this.gameState.gameSpeed = 8;
	}

	movePlayer1(movePlayer: number[]): void{
		this.gameState.player1 = movePlayer;
	}

	movePlayer2(moveOpponent: number[]): void{
		this.gameState.player2 = moveOpponent;
	}

	setnumofPlayers(): void{
		this.gameState.numofPlayers = 2;
	}

	updateScores(): void{
		if (this.gameState.deltaX !== -1) {
			this.gameState.playerScore++;
			console.log("player scores");
		} else {
			this.gameState.opponentScore++;
			console.log("opponent scores");
		}
	}

	getwinner(): boolean{
		if (this.gameState.playerScore === 10 || this.gameState.opponentScore === 10)
			return true;
		return false;
	}

	bounceBall():void{
		const newstate = this.gameState.ball + (this.gameState.deltaY + this.gameState.deltaX);
		// console.log(newstate);
		if (this.rightleftEdge(newstate)) {
			//they missed the ball , the direction should change for next start
			this.gameState.deltaX = -this.gameState.deltaX;
			this.gameState.ball = Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE;
		}
		else{
			if (this.topbottomEdge(newstate))
				this.gameState.deltaY = -this.gameState.deltaY;
			else if (this.touchingPaddleEdge(newstate) || this.touchingPaddle(newstate)){
				this.gameState.deltaX = -this.gameState.deltaX;
				this.updateScores();
			}
			this.gameState.ball = newstate;
		}
	}

	private topbottomEdge(pos: number): boolean {
		return (pos < COL_SIZE + 1 || //top edge
			pos >= (ROW_SIZE - 1) * COL_SIZE - 1);
	}

	private rightleftEdge(pos: number): boolean {
		return (pos % COL_SIZE === 0 || // Ball touches left edge
		pos % COL_SIZE === COL_SIZE - 1);
	}

	private touchingPaddle(pos: number): boolean {
		const { player1, player2, deltaX } = this.gameState;
		const paddle =
			deltaX === -1 ? player1: player2.map((x) => x + deltaX);
		return paddle.includes(pos);
	}

	private touchingPaddleEdge(pos: number): boolean {
		const { player1, player2 } = this.gameState;
		const player1Edges = [player1[0], player1[player1.length - 1]];
		const player2Edges = [player2[0], player2[player2.length - 1]];
		return player1Edges.includes(pos) || player2Edges.includes(pos);
	}
}

	// updateBallPosition(bounceBallDto: BounceBallDto): void{
	// 	this.gameState.deltaX = bounceBallDto.deltaX;
	// 	this.gameState.deltaY = bounceBallDto.deltaY;
	// 	this.gameState.ball = this.gameState.ball + bounceBallDto.deltaY + bounceBallDto.deltaX;
	// }

	// isScore(pos: number): boolean {
	// 	const { deltaX, ball } = this.gameState;
	// 	if (deltaX === -1) {
	// 	  // Ball moving towards the opponent's side

	// 	  const opponentScoreRange = [COL_SIZE - 1, COL_SIZE, 0];
	// 	  const isOpponentScore = opponentScoreRange.includes(pos % COL_SIZE) && ball >= pos;
	// 	  console.log(`Opponent score: pos=${pos}, ball=${ball}, isScore=${isOpponentScore}`);

	// 		return isOpponentScore;
	// 	} else {
	// 		// Ball moving towards the player's side
	// 		const playerScoreRange = [0, 1];
	// 		const isPlayerScore = playerScoreRange.includes(pos % COL_SIZE) && ball <= pos;
	// 		console.log(`Player score: pos=${pos}, ball=${ball}, isScore=${isPlayerScore}`);

	// 		return isPlayerScore;
	// 	}
	// }
