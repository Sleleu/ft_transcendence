import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameState, BounceBallDto} from './dto/game.dto';

const PADDLE_BOARD_SIZE = 3;
const PADDLE_EDGE_SPACE = 1;

const ROW_SIZE = 10;
const COL_SIZE = 20;

const board = [...Array(PADDLE_BOARD_SIZE)].map((_, pos) => pos);

@Injectable()
export class GameService {

	private gameState: GameState = {
		player1: board.map((x) => x * COL_SIZE + PADDLE_EDGE_SPACE),
		player2: board.map((x) => (x + 1) * COL_SIZE - (PADDLE_EDGE_SPACE + 1)),
		ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE, // Initial ball position
		deltaX: -1, // Initial ball delta x
		deltaY: -COL_SIZE, // Initial ball delta y
		playerScore: 0, // Initial player score
		opponentScore: 0, // Initial opponent score
		pause: true, // Initial game state (paused)
	};

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
		console.log("server service: resetGame");
		this.gameState = {
			player1: board.map((x) => x * COL_SIZE + PADDLE_EDGE_SPACE), // Reset player board
			player2: board.map((x) => (x + 1) * COL_SIZE - (PADDLE_EDGE_SPACE + 1)), // Reset opponent board
			ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE, // Reset ball position
			deltaX: -1, // Reset ball delta x
			deltaY: -COL_SIZE, // Reset ball delta y
			playerScore: 0, // Reset player score
			opponentScore: 0, // Reset opponent score
			pause: true, // Reset game state (paused)
		};
	}

	movePlayer1(movePlayer: number[]): void{
		// console.log("server service: move-player");
		this.gameState.player1 = movePlayer;
	}

	movePlayer2(moveOpponent: number[]): void{
		console.log("server service: move-opponent");
		this.gameState.player2 = moveOpponent;
	}

	updateBallPosition(bounceBallDto: BounceBallDto): void{
		console.log("server service: update ball position");
		this.gameState.deltaX = bounceBallDto.deltaX;
		this.gameState.deltaY = bounceBallDto.deltaY;
		this.gameState.ball = this.gameState.ball + bounceBallDto.deltaY + bounceBallDto.deltaX;
	}

	isScore(pos: number): boolean {
		const { deltaX } = this.gameState;
		const scoreRange = deltaX === -1 ? [COL_SIZE - 1, COL_SIZE] : [0, 1];
		return scoreRange.includes(pos % COL_SIZE);
	}

	getwinner(): boolean{
		if (this.gameState.playerScore === 1 || this.gameState.opponentScore === 1)
			return true;
		return false;
	}

	bounceBall():void{

		const newstate = this.gameState.ball + this.gameState.deltaY + this.gameState.deltaX;

		if (this.rightleftEdge(newstate)) {
			// console.log("service: rightleft edge");
			// this.resetGame();
			this.gameState.ball = Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE;
		}
		else if (this.topbottomEdge(newstate)) {
			this.gameState.deltaY = -this.gameState.deltaY;
			this.gameState.ball = newstate;
			// console.log("service: touching topbottom edge");
		}
		else if (this.touchingPaddleEdge(newstate)) {
			this.gameState.deltaY = -this.gameState.deltaY;
			this.gameState.ball = newstate;
			console.log("service: touching paddle edge");
		}
		else if (this.touchingPaddle(newstate)) {
			this.gameState.deltaX = -this.gameState.deltaX;
			this.gameState.ball = newstate;
			console.log("service: touching paddle " + this.gameState.ball + ": " + this.gameState.deltaX, ", ", this.gameState.deltaY);
		}
		else
		{
			// console.log("service: updating ball movement");
			this.gameState.ball = newstate;
		}
		// Check if a score occurs
		if (this.isScore(this.gameState.ball))
		{
			console.log("somebody scored");
		  if (this.gameState.deltaX !== -1) {
			this.gameState.playerScore++;
			console.log("player scores");
		  } else {
			this.gameState.opponentScore++;
			console.log("opponent scores");
		  }
		  if (this.getwinner())
		  {
			//technicall game over the screen should change
			this.gameState.pause = true;
		  	this.resetGame();
		  }
		  return;
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
