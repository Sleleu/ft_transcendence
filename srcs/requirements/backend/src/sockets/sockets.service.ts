import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageObj } from './entities/message.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from '@prisma/client';
import { GameState, BounceBallDto} from './dto/game.dto';

const PADDLE_BOARD_SIZE = 3;
const PADDLE_EDGE_SPACE = 1;

const ROW_SIZE = 10;
const COL_SIZE = 20;

const board = [...Array(PADDLE_BOARD_SIZE)].map((_, pos) => pos);

@Injectable()
export class SocketsService {
  messages: MessageObj[] = [{id: 1, name: 'gmansuy', text: 'heyooo'}, {id: 2, name: 'Sleleu', text: 'yooo'}];
  private clientToUser: { [clientId: string]: string } = {};

  private gameState: GameState = {
		player: board.map((x) => x * COL_SIZE + PADDLE_EDGE_SPACE),
		opponent: board.map((x) => (x + 1) * COL_SIZE - (PADDLE_EDGE_SPACE + 1)),
		ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE, // Initial ball position
		ballSpeed: 300,
		deltaX: -1, // Initial ball delta x
		deltaY: -COL_SIZE, // Initial ball delta y
		playerScore: 0, // Initial player score
		opponentScore: 0, // Initial opponent score
		pause: true, // Initial game state (paused)
		opponentDir: false, // Initial opponent direction
		opponentSpeed:300,
	};

  //Gabriel part start
  constructor(private prisma: PrismaService) { }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.prisma.message.create({
      data : {
        name: createMessageDto.name,
        text: createMessageDto.text,
      }
    })
    return message;
  }

  findAll() {
    const messages = this.prisma.message.findMany();
    return messages;
  }
  //gabriel part end

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
			player: board.map((x) => x * COL_SIZE + PADDLE_EDGE_SPACE), // Reset player board
			opponent: board.map((x) => (x + 1) * COL_SIZE - (PADDLE_EDGE_SPACE + 1)), // Reset opponent board
			ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE, // Reset ball position
			ballSpeed: 300,
			deltaX: -1, // Reset ball delta x
			deltaY: -COL_SIZE, // Reset ball delta y
			playerScore: 0, // Reset player score
			opponentScore: 0, // Reset opponent score
			pause: true, // Reset game state (paused)
			opponentDir: false, // Reset opponent direction
			opponentSpeed: 300,
		};
	}

	movePlayer(movePlayer: number[]): void{
		// console.log("server service: move-player");
		this.gameState.player = movePlayer;
	}

	moveOpponent(moveOpponent: number[]): void{
		console.log("server service: move-opponent");
		this.gameState.opponent = moveOpponent;
	}

	updateBallPosition(bounceBallDto: BounceBallDto): void{
		console.log("server service: update ball position");
		this.gameState.deltaX = bounceBallDto.deltaX;
		this.gameState.deltaY = bounceBallDto.deltaY;
		this.gameState.ball = this.gameState.ball + bounceBallDto.deltaY + bounceBallDto.deltaX;
	}

	// private isScore(pos: number, COL_SIZE: number, ROW_SIZE: number): boolean {
	// 	return (
	// 	  (this.gameState.deltaX === -1 && (pos + 1) % COL_SIZE === 0) ||
	// 	  (this.gameState.deltaX === 1 && pos % COL_SIZE === 0)
	// 	);
	// }

	bounceBall():void{

		console.log("server bounceball function");
		// Update ball position
		const newstate = this.gameState.ball + this.gameState.deltaY + this.gameState.deltaX;

		if (this.rightleftEdge(this.gameState.ball)) {
			console.log("service: rightleft edge");
			this.resetGame();
		}
		else if (this.topbottomEdge(this.gameState.ball)) {
			this.gameState.deltaY = -this.gameState.deltaY;
			this.gameState.ball = newstate;
			console.log("service: touching topbottom edge");
		}
		else if (this.touchingPaddleEdge(this.gameState.ball)) {
		  this.gameState.deltaY = -this.gameState.deltaY;
		  this.gameState.ball = newstate;
		  console.log("service: touching paddle edge");
		}
		else if (this.touchingPaddle(this.gameState.ball)) {
		  this.gameState.deltaX = -this.gameState.deltaX;
		  this.gameState.ball = newstate;
		  console.log("service: touching paddle ");
		}
		else
		{
			console.log("service: updating ball movement");
			this.gameState.ball = newstate;
		}
		// Check if a score occurs
		// if (this.isScore(this.gameState.ball, COL_SIZE, ROW_SIZE)) {
		//   if (this.gameState.deltaX !== -1) {
		// 	this.gameState.playerScore++;
		//   } else {
		// 	this.gameState.opponentScore++;
		//   }
		//   this.gameState.pause = true;
		//   this.resetGame();
		//   return;
		// }
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

}
