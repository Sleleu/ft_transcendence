import { Controller, Get, Post, Put, Delete, Body} from '@nestjs/common';
import { GameService } from './game.service';
import { GameState, MovePlayerDto, MoveOpponentDto, BounceBallDto } from './game.dto';
// import { AuthGaurd } from '@nestjs/passport';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService){}

	@Get()
	getGameState() : GameState{
		return this.gameService.getGameState();
	}

	@Post('start')
	startGame(): void{
		console.log("start game controller side")
		this.gameService.startGame();
	}

	@Post('pause')
	pauseGame(): void{
		this.gameService.pauseGame();
	}

	@Post('reset')
	resetGame(): void{
		this.gameService.resetGame();
	}

	@Put('move-player')
	movePlayer(@Body() movePlayerDto: MovePlayerDto): void{
		this.gameService.movePlayer(movePlayerDto);
	}

	@Put('move-opponent')
	moveOpponent(@Body() moveOpponentDto: MoveOpponentDto): void{
		this.gameService.moveOpponent(moveOpponentDto);
	}

	@Put('bounceBall')
	bounceBall(@Body() bounceBallDto: BounceBallDto): void{
		this.gameService.bounceBall(bounceBallDto);
	}

}
