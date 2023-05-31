
export interface GameState {
	player: number[];
	opponent: number[];
	ball: number;
	ballSpeed: number;
	deltaY: number;
	deltaX: number;
	opponentDir: boolean;
	opponentSpeed: number;
	pause: boolean;
	playerScore: number;
	opponentScore: number;
	}

  export interface BounceBallDto {
	deltaX: number;
	deltaY: number;
  }
