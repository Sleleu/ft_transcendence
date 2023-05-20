import React, { useEffect, useState, CSSProperties } from 'react';
import Box, { BACKGROUND, PLAYER, BALL } from './box';

/* size */
const ROW_SIZE = 10;
const COL_SIZE = 20;

/* paddle */
const PADDLE_BOARD_SIZE = 3;
const PADDLE_EDGE_SPACE = 1;

/* buttons */
const PLAYER_UP = 38; // up arrow
const PLAYER_DOWN = 40; // down arrow
const PAUSE = 32; // space
const PLAY = 13; // ENTER
const OPPONENT_UP = 90;
const OPPONENT_DOWN = 98;

const inner: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",

};

const outer: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
  // marginTop: "9em",
  // marginLeft: "25em",
  padding: "10px",
};

const dividerStyle = {
  marginLeft: "50px",
  fontSize: "50px",
  color: "white",
};

const score = {
  marginLeft: "100px",
  fontSize: "50px",
  color: "white",
};

const style = {
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
    ballSpeed: 400,
    deltaY: -COL_SIZE,
    deltaX: -1,
    opponentDir: false,
    opponentSpeed: 300,
    pause: true,
    playerScore: 0,
    opponentScore: 0,
  };
};

interface GameProps {
  changeComponent: (component: string) => void;
}

const Game: React.FC<GameProps> = ({ changeComponent }) => {
  const [state, setState] = useState<GameState>(InitialState());

  const handleMouseMove = (event: React.MouseEvent) => {
    const container = document.getElementById("root");
    let movedPlayer: number[] | null = null;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const mouseY = event.clientY - containerRect.top;
      const playerBoard = state.player;
      const isUp = mouseY < containerRect.height / 2;
      movedPlayer = moveBoard(playerBoard, isUp);
    }
    if (movedPlayer !== null) {
      setState({
        ...state,
        player: movedPlayer,
        pause: false,
      });
    }
  };

  const resetGame = () => setState((prevState) => ({ ...prevState, ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE }));

  const moveBoard = (playerBoard: number[], isUp: boolean) => {
    const playerEdge = isUp ? playerBoard[0] : playerBoard[PADDLE_BOARD_SIZE - 1];
    const deltaY = isUp ? -COL_SIZE : COL_SIZE;

    if (!touchingEdge(playerEdge)) {
      return playerBoard.map((x) => x + deltaY);
    }

    return null;
  };

  const touchingEdge = (pos: number) =>
    (0 <= pos && pos < COL_SIZE) || (COL_SIZE * (ROW_SIZE - 1) <= pos && pos < COL_SIZE * ROW_SIZE);

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
    (state.deltaX === -1 && pos % COL_SIZE === 0) ||
    (state.deltaX === 1 && (pos + 1) % COL_SIZE === 0);

  const moveOpponent = () => {
    const movedPlayer = moveBoard(state.opponent, state.opponentDir);
    movedPlayer ? setState((prevState) => ({ ...prevState, opponent: movedPlayer })) : setState((prevState) => ({ ...prevState, opponentDir: !prevState.opponentDir }));
  };

  const bounceBall = () => {
    const newState = state.ball + state.deltaY + state.deltaX;

    console.log("bounceball");
    console.log(state.pause);
    console.log(state.deltaY);
    console.log(state.deltaX);
    console.log(state.ball);
    console.log(newState);



    if (touchingEdge(newState)) {
      console.log("touchingedge");
      setState((prevState) => ({ ...prevState, deltaY: -prevState.deltaY }));
    }

    if (touchingPaddleEdge(newState)) {
      console.log("touchingPaddleEdge");
      setState((prevState) => ({ ...prevState, deltaY: -prevState.deltaY }));
    }

    if (touchingPaddle(newState)) {
      console.log("touchingPaddle");
      setState((prevState) => ({ ...prevState, deltaX: -prevState.deltaX }));
    }

    setState((prevState) => ({ ...prevState, ball: newState }));

    if (isScore(newState)) {
      if (state.deltaX !== -1) {
        setState((prevState) => ({
          ...prevState,
          playerScore: prevState.playerScore + 1,
          ball: newState,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          opponentScore: prevState.opponentScore + 1,
          ball: newState,
        }));
      }
      setState((prevState) => ({ ...prevState, pause: true }));
      resetGame();
    }
  };

  const keyInput = ({ keyCode }: KeyboardEvent) => {
    console.log("calling keyinput");
    switch (keyCode) {
      case PLAY:
        console.log("PLAY keyinput");
        setState((prevState) => ({ ...prevState, pause: false }));
        break;
      case PAUSE:
        console.log("pause keyinput");
        setState((prevState) => ({ ...prevState, pause: true }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    /* moving the ball */
    const ballInterval = setInterval(() => {
      if (!state.pause) {
        bounceBall();
      }
    }, state.ballSpeed);

    /* moving the opponent */
    const opponentInterval = setInterval(() => {
      if (!state.pause) {
        moveOpponent();
      }
    }, state.opponentSpeed);

    document.addEventListener("keydown", keyInput);
    return () => {
      clearInterval(ballInterval);
      clearInterval(opponentInterval);
      document.removeEventListener("keydown", keyInput);
    };
  }, [state.pause, state.ballSpeed, state.opponentSpeed]);

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
    <div style={outer}>
      <h1>{"PING-PONG"}</h1>
      <div style={inner}>
        <div style={style}>{board}</div>
        <div style={score}>{state.playerScore}</div>
        <div style={dividerStyle}>{divider} </div>
        <div style={dividerStyle}>{state.opponentScore}</div>
      </div>
      <h3>{"press any key to start/pause"}</h3>
    </div>
  );
};

export default Game;
