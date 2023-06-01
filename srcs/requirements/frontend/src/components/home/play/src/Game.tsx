import React, { useEffect, useState, CSSProperties } from 'react';
import Box, { BACKGROUND, PLAYER, BALL } from './box';
import { io, Socket } from 'socket.io-client';
import '../css/Game.css'

/* size */
const ROW_SIZE = 10;
const COL_SIZE = 20;

/* paddle */
const PADDLE_BOARD_SIZE = 3;
const PADDLE_EDGE_SPACE = 1;

/* buttons */
const PAUSE = 32; // space
const PLAY = 13; // ENTER

type GameState = {
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
  playerID: number;
};

const InitialState = (): GameState => {
  const board = [...Array(PADDLE_BOARD_SIZE)].map((_, pos) => pos);
  return {
    player: board.map((x) => x * COL_SIZE + PADDLE_EDGE_SPACE),
    opponent: board.map((x) => (x + 1) * COL_SIZE - (PADDLE_EDGE_SPACE + 1)),
    ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE,
    ballSpeed: 100,
    deltaX: -1,
    deltaY: -COL_SIZE,
    playerScore: 0,
    opponentScore: 0,
    pause: true,
    opponentDir: false,
    opponentSpeed: 300,
    playerID: 0,
  };
};

interface GameProps {
  changeComponent: (component: string) => void;
  socket?: Socket;
  opponentID: string | number;
}

const Game: React.FC<GameProps> = ({ changeComponent, socket, opponentID}) => {
  const [state, setState] = useState<GameState>(InitialState());

  useEffect(() => {
    console.log("client side: joining a room");
    socket?.emit('join-room', socket.id);

    return () => {
      socket?.disconnect();
    };
  }, []);

  const resetGame = () => {
    setState(InitialState());
  };

  const topbottomEdge = (pos: number) =>
    pos < COL_SIZE + 1 || // Ball touches top edge
    pos >= (ROW_SIZE - 1) * COL_SIZE - 1;

  socket?.on('gameState', (gameState: GameState) => {
    console.log("client side event: gameState");
    setState(gameState);
  });

  socket?.on('game-over', (gameState: GameState) => {
    console.log("client side event: game over");
    resetGame();
  });

  socket?.on('start', (_playerID: number) => {
    console.log("client side event: start");
    setState((prevState) => ({
      ...prevState,
      pause: false,
      playerID: _playerID,
    }));
  });

  socket?.on('pause', () => {
    console.log("client side event: pause");
    setState((prevState) => ({
      ...prevState,
      pause: true,
    }));
  });

  socket?.on('reset', () => {
    console.log("client side event: reset");
    resetGame();
  });

  socket?.on('updateBallPosition', (gameState: GameState) => {
    console.log("client side event: updateBallPosition ", socket.id);
    setState((prevState) => ({
      ...prevState,
      deltaX: gameState.deltaX,
      deltaY: gameState.deltaY,
      ball: gameState.ball,
      playerScore: gameState.playerScore,
      opponentScore: gameState.opponentScore,
    }));
  });

  socket?.on('move-opponent', (gameState: GameState) => {
    console.log("client side event: move-opponent");
    if (state.playerID === 1)
    {
      setState((prevState) => ({
        ...prevState,
        opponent: gameState.opponent,
      }));
    }
    else
    {
      setState((prevState) => ({
        ...prevState,
        player: gameState.opponent,
      }));
    }
  });

  socket?.on('score', (gameState: GameState) => {
    console.log("client side event: score");
    setState((prevState) => ({
      ...prevState,
      playerScore: gameState.playerScore,
    }));
  });

  socket?.on('game-over', (gameState: GameState) => {
    console.log("client side event: game-over");
  });

  //keyboard events are only for debugging
  const keyInput = (event : KeyboardEvent) => {
    const{ key } = event;
    console.log("calling keyinput");
    switch (key) {
      case "Enter":
        console.log("PLAY keyinput");
        socket?.emit('start');
        break;
      case " ":
        console.log("pause keyinput");
        socket?.emit('pause');
        break;
      default:
        break;
    }
  };

  const moveBoard = (playerBoard: number[], isUp: boolean) => {
    const playerEdge = isUp ? playerBoard[0] : playerBoard[PADDLE_BOARD_SIZE - 1];
    const deltaY = isUp ? -COL_SIZE : COL_SIZE;

    if (!topbottomEdge(playerEdge)) {
      return playerBoard.map((x) => x + deltaY);
    }

    return playerBoard;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (state.pause)
      return ;
    const container = document.getElementById("game");
    let movedPlayer: number[] | null = null;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const mouseY = event.clientY - containerRect.top;
      let playerBoard;
      if (state.playerID === 1)
        playerBoard = state.player;
      else
        playerBoard = state.opponent;
      const isUp = mouseY < containerRect.height / 2;
      movedPlayer = moveBoard(playerBoard, isUp);
    }
    if (movedPlayer !== null) {
      socket?.emit('move-player', movedPlayer, state.playerID);
      if (state.playerID === 1)
      {
        setState((prevState) => ({
            ...prevState,
            player: movedPlayer,
        }) as GameState);
      }
      else
      {
        setState((prevState) => ({
            ...prevState,
            opponent: movedPlayer,
        }) as GameState);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', keyInput);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('keydown', keyInput);
      document.removeEventListener('mousemove', handleMouseMove);

    };
  }, [keyInput, handleMouseMove]);

  const board = [...Array(ROW_SIZE * COL_SIZE)].map((_, pos) => {
    let val = BACKGROUND;
    if (
      state.player.indexOf(pos) !== -1 ||
      state.opponent.indexOf(pos) !== -1
    ) {
      val = PLAYER;
    } else if (state.ball === pos) {
      val = BALL;
    }
    return <Box key={pos} name={val} />;
  });

  const divider = [...Array(ROW_SIZE / 2 + 2)].map((_, index) => <div key={index}>{"|"}</div>);

  return (
    <div id="game" className="outer">
      <div className="style">
        <div className="style">{board}</div>
        <div className="score">{state.playerScore}</div>
        <div className="dividerStyle">{divider} </div>
        <div className="dividerStyle">{state.opponentScore}</div>
      </div>
    </div>
  );
};

export default Game;
