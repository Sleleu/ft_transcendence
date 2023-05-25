import { Injectable } from '@nestjs/common';
import { GameState, MovePlayerDto, MoveOpponentDto, BounceBallDto} from './game.dto';
import { Interval } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { createServer } from 'http';

@Injectable()
export class GameService{
	private gameState: GameState = {
		player: [], // Initial player board
		opponent: [], // Initial opponent board
		ball: 0, // Initial ball position
		ballSpeed: 200,
		deltaX: 1, // Initial ball delta x
		deltaY: 1, // Initial ball delta y
		playerScore: 0, // Initial player score
		opponentScore: 0, // Initial opponent score
		pause: true, // Initial game state (paused)
		opponentDir: true, // Initial opponent direction
		opponentSpeed:300,

	};

	private io
	constructor(){
		this.io = new Server();
	}

	getGameState() : GameState{
		return this.gameState;
	}

	startGame(): void {
		this.gameState.pause = false;
		console.log("im here inside startGame");
		this.emitGameState();
	}

	pauseGame(): void {
		this.gameState.pause = true;
		this.emitGameState();
	}

	resetGame(): void{
		this.gameState = {
			player: [], // Reset player board
			opponent: [], // Reset opponent board
			ball: 0, // Reset ball position
			ballSpeed: 200,
			deltaX: 1, // Reset ball delta x
			deltaY: 1, // Reset ball delta y
			playerScore: 0, // Reset player score
			opponentScore: 0, // Reset opponent score
			pause: true, // Reset game state (paused)
			opponentDir: true, // Reset opponent direction
			opponentSpeed: 300,
		};
		this.emitGameState();
	}

	movePlayer(movePlayerDto: MovePlayerDto): void{
		this.gameState.player = movePlayerDto.player;
		this.gameState.pause = movePlayerDto.pause;
		this.emitGameState();
	}

	moveOpponent(moveOpponentDto: MoveOpponentDto): void{
		this.gameState.opponent = moveOpponentDto.opponent;
		this.emitGameState();
	}

	bounceBall(bounceBallDto: BounceBallDto): void{
		this.gameState.deltaX = bounceBallDto.deltaX;
		this.gameState.deltaY = bounceBallDto.deltaY;
		this.emitGameState();
	}

	private updateGameState():void{
		const COL_SIZE = 20;
		const ROW_SIZE = 10;

		// Update ball position
		this.gameState.ball += this.gameState.deltaY + this.gameState.deltaX;

		// Check if the ball touches the edge
		if (this.touchingEdge(this.gameState.ball, COL_SIZE, ROW_SIZE)) {
		  this.gameState.deltaY = -this.gameState.deltaY;
		}

		// Check if the ball touches a paddle edge
		if (this.touchingPaddleEdge(this.gameState.ball)) {
		  this.gameState.deltaY = -this.gameState.deltaY;
		}

		// Check if the ball touches a paddle
		if (this.touchingPaddle(this.gameState.ball)) {
		  this.gameState.deltaX = -this.gameState.deltaX;
		}

		// Check if a score occurs
		if (this.isScore(this.gameState.ball, COL_SIZE, ROW_SIZE)) {
		  if (this.gameState.deltaX !== -1) {
			this.gameState.playerScore++;
		  } else {
			this.gameState.opponentScore++;
		  }
		  this.gameState.pause = true;
		  this.resetGame();
		  return;
		}
	}

	private touchingEdge(pos: number, COL_SIZE: number, ROW_SIZE: number): boolean {
		return (
		  pos % COL_SIZE === 0 ||
		  pos % COL_SIZE === COL_SIZE - 1 ||
		  pos < COL_SIZE ||
		  pos >= (ROW_SIZE - 1) * COL_SIZE
		);
	}

	private touchingPaddle(pos: number): boolean {
		const { player, opponent, deltaX } = this.gameState;
		const paddle =
		  deltaX === -1 ? player : opponent.map((x) => x + deltaX);
		return paddle.includes(pos);
	}

	private touchingPaddleEdge(pos: number): boolean {
		const { player, opponent } = this.gameState;
		const playerEdges = [player[0], player[player.length - 1]];
		const opponentEdges = [opponent[0], opponent[opponent.length - 1]];
		return playerEdges.includes(pos) || opponentEdges.includes(pos);
	}

	private isScore(pos: number, COL_SIZE: number, ROW_SIZE: number): boolean {
		return (
		  (this.gameState.deltaX === -1 && (pos + 1) % COL_SIZE === 0) ||
		  (this.gameState.deltaX === 1 && pos % COL_SIZE === 0)
		);
	}

	private emitGameState():void{
		console.log("im here inside emitGameState");
		this.io.emit('gameState', this.gameState);
	}

	@Interval(16)
	private updateGameStateInterval(): void{
		if (!this.gameState.pause){
			this.updateGameState();
			this.emitGameState();
		}
	}
}
