import React, { useEffect, useState, CSSProperties } from 'react';
import Box, { BACKGROUND, PLAYER, BALL } from './box';
import { io, Socket } from 'socket.io-client';

/* size */
const ROW_SIZE = 10;
const COL_SIZE = 20;

/* paddle */
const PADDLE_BOARD_SIZE = 3;
const PADDLE_EDGE_SPACE = 1;

/* buttons */

const PAUSE = 32; // space
const PLAY = 13; // ENTER

const TextStyle: CSSProperties = {
  color: "purple",
};

const inner: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",

};

const outer: CSSProperties = {
  height: '100%',
  width: '100%',
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "9em",
  marginRight: "35em",
  padding: "10px",
};

const dividerStyle: CSSProperties  = {
  marginLeft: "50px",
  fontSize: "50px",
  color: "white",
};

const score: CSSProperties  = {
  marginLeft: "100px",
  fontSize: "50px",
  color: "white",
};

const style: CSSProperties  = {
  width: "250px",
  height: "250px",
  display: "grid",
  gridTemplate: `repeat(${ROW_SIZE}, 1fr)/ repeat(${COL_SIZE}, 1fr)`,
};

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
};

const InitialState = (): GameState => {
  const board = [...Array(PADDLE_BOARD_SIZE)].map((_, pos) => pos);
  return {
    player: board.map((x) => x * COL_SIZE + PADDLE_EDGE_SPACE),
    opponent: board.map((x) => (x + 1) * COL_SIZE - (PADDLE_EDGE_SPACE + 1)),
    ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE,
    ballSpeed: 300,
    deltaX: -1,
    deltaY: -COL_SIZE,
    playerScore: 0,
    opponentScore: 0,
    pause: true,
    opponentDir: false,
    opponentSpeed: 300,
  };
};

interface GameProps {
  changeComponent: (component: string) => void;
}

const Game: React.FC<GameProps> = ({ changeComponent }) => {
  const [state, setState] = useState<GameState>(InitialState());
  const [socket, setSocket ] = useState<Socket | null> (null);

  useEffect(() => {

    const socket = io('http://localhost:5000')
    setSocket(socket);
    //Handle game state updates
    console.log("after setting socket");

    socket?.on('gameState', (gameState: GameState) => {
      console.log("client side event: gameState");
      setState(gameState);
    });

    socket?.on('start', () => {
      console.log("client side event: start");
      setState((prevState) => ({
        ...prevState,
        pause: false,
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

    socket?.on('bounceBall', (gameState: GameState) => {
      console.log("client side event: bounceball");
      setState(gameState);
    });

    socket?.on('move-player', (gameState: GameState) => {
      console.log("client side event: move-player");
      // setState(gameState);
    });

    socket?.on('move-opponent', (gameState: GameState) => {
      console.log("client side event: move-opponent");
      // setState(gameState);
    });

    socket?.on('changeOpponentDir', () => {
      console.log("client side event: changeOpponentDir");
      setState((prevState) => ({
        ...prevState,
        opponentDir: !prevState.opponentDir,
      }));
    });

    socket?.on('score', (gameState: GameState) => {
      console.log("client side event: score");
      setState(gameState);
    });

    if (!state.pause){
      const intervalId = setInterval(bounceBall, state.ballSpeed); // Call bounceBall repeatedly
      console.log("inside the if statement")
      return () => {
        clearInterval(intervalId);
      };
    }

    return () => {
      socket.disconnect();
    };
  }, [state.pause]);

  const resetGame = () => {
    setState(InitialState());
    socket?.emit('reset');
  };

  const topbottomEdge = (pos: number) =>
    pos < COL_SIZE + 1 || // Ball touches top edge
    pos >= (ROW_SIZE - 1) * COL_SIZE - 1;

  const rightleftEdge = (pos: number) =>
    pos % COL_SIZE === 0 || // Ball touches left edge
    pos % COL_SIZE === COL_SIZE - 1;

  const touchingPaddle = (pos: number) =>
    state.player.indexOf(pos) !== -1 ||
    state.opponent.indexOf(pos) !== -1 ||
    state[(state.deltaX === -1 ? "player" : "opponent")].indexOf(pos + state.deltaX) !== -1;

  const touchingPaddleEdge = (pos: number) =>
    state.player[0] === pos ||
    state.player[PADDLE_BOARD_SIZE - 1] === pos ||
    state.opponent[0] === pos ||
    state.opponent[PADDLE_BOARD_SIZE - 1] === pos;

  const isScore = (pos: number) =>
    (state.deltaX === -1 && (pos + 1) % COL_SIZE === 0) ||
    (state.deltaX === 1 && (pos + 1) % COL_SIZE === 0);

  // const moveOpponent = () => {
  //   const movedPlayer = moveBoard(state.opponent, state.opponentDir);
  //   movedPlayer
  //     ? socket?.emit('move-opponent', movedPlayer)
  //     : socket?.emit('changeOpponentDir');
  // };

  const bounceBall = () => {

    setState((prevState) => {
      const newState = prevState.ball + prevState.deltaY + prevState.deltaX;

      if (rightleftEdge(newState)){
        resetGame();
        return prevState;
      }

      if (topbottomEdge(newState)) {
        socket?.emit('bounceBall', { deltaX: prevState.deltaX, deltaY: -prevState.deltaY });
        console.log("touching the edge: ", state.ball + ", " + state.player);
        return {
          ...prevState,
          ball: newState,
          deltaY: - prevState.deltaY,
        };
      }

      if (touchingPaddleEdge(newState)) {
        socket?.emit('bounceBall', { deltaX: prevState.deltaX, deltaY: -prevState.deltaY });
        console.log("touching the paddle edge: ", state.ball + ", " + state.player);
        return {
          ...prevState,
          ball: newState,
          deltaY: - prevState.deltaY,
        };
      }

      if (touchingPaddle(newState)) {
        socket?.emit('bounceBall', { deltaX: -prevState.deltaX, deltaY: prevState.deltaY });
        console.log("touching the paddle: ", state.ball + ", " + state.player);

        return {
          ...prevState,
          ball: newState,
          deltaX: - prevState.deltaX,
        };
      }

      return {
        ...prevState,
        ball: newState,
      };
    });
  };

  // useEffect(() => {
  //   console.log('New state:', state);
  // }, [state]);

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

  const handleMouseMove = (event: MouseEvent) => {
    if (state.pause)
      return ;
    const container = document.getElementById("game");
    let movedPlayer: number[] | null = null;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const mouseY = event.clientY - containerRect.top;
      const playerBoard = state.player;
      const isUp = mouseY < containerRect.height / 2;
      movedPlayer = moveBoard(playerBoard, isUp);
      console.log("board position: ", movedPlayer + "ball position: " + state.ball);
    }
    if (movedPlayer !== null) {
      socket?.emit('move-player', movedPlayer);
      setState((prevState) => ({
          ...prevState,
          player: movedPlayer,
      }) as GameState);
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
    <div id="game" style={outer}>
      <div style={style}>
        <div style={style}>{board}</div>
        <div style={score}>{state.playerScore}</div>
        <div style={dividerStyle}>{divider} </div>
        <div style={dividerStyle}>{state.opponentScore}</div>
      </div>
    </div>
  );
};

export default Game;
