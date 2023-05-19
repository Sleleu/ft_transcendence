import React, { Component, CSSProperties} from 'react';
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
  justifyContent: "justify",
};

const outer: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "justify",
  marginTop: "9em",
  marginLeft: "25em",
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

const InitialState = () => {
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

class Game extends Component {
  state = InitialState();

  handleMouseMove = (event: MouseEvent) => {
    const container = document.getElementById("root");
    let movedPlayer: number[] | false | undefined;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const mouseY = event.clientY - containerRect.top;
      const playerBoard = this.state.player;
      const isUp = mouseY < containerRect.height / 2;
      movedPlayer = this.moveBoard(playerBoard, isUp);
    }
    if (movedPlayer !== undefined) {
      this.setState((prevState) => ({
        ...prevState,
        player: movedPlayer,
        pause: false,
      }));
    }
  };

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
  }

  resetGame = () => this.setState({ ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE });

  moveBoard = (playerBoard: number[], isUp: boolean) => {
    const playerEdge = isUp ? playerBoard[0] : playerBoard[PADDLE_BOARD_SIZE - 1];
    const deltaY = isUp ? -COL_SIZE : COL_SIZE;

    if (!this.touchingEdge(playerEdge)) {
      return playerBoard.map((x) => x + deltaY);
    }

    return false;
  };

  componentDidMount() {
    /* moving the ball */
    window.addEventListener("mousemove", this.handleMouseMove);
    setInterval(() => {
      if (!this.state.pause) {
        this.bounceBall();
      }
    }, this.state.ballSpeed);
    /* moving the opponent */
    setInterval(() => {
      if (!this.state.pause) {
        this.moveOpponent();
      }
    }, this.state.opponentSpeed);
    document.onkeydown = this.keyInput;
    // document.title = "ping-pong"
  }

  touchingEdge = (pos: number) =>
    (0 <= pos && pos < COL_SIZE) || (COL_SIZE * (ROW_SIZE - 1) <= pos && pos < COL_SIZE * ROW_SIZE);

  touchingPaddle = (pos: number) =>
    this.state.player.indexOf(pos) !== -1 ||
    this.state.opponent.indexOf(pos) !== -1 ||
    this.state[(this.state.deltaX === -1 ? "player" : "opponent")].indexOf(pos + this.state.deltaX) !== -1;

  touchingPaddleEdge = (pos: number) =>
    this.state.player[0] === pos ||
    this.state.player[PADDLE_BOARD_SIZE - 1] === pos ||
    this.state.opponent[0] === pos ||
    this.state.opponent[PADDLE_BOARD_SIZE - 1] === pos;

  isScore = (pos: number) =>
    (this.state.deltaX === -1 && pos % COL_SIZE === 0) ||
    (this.state.deltaX === 1 && (pos + 1) % COL_SIZE === 0);

  moveOpponent = () => {
    const movedPlayer = this.moveBoard(this.state.opponent, this.state.opponentDir);
    movedPlayer ? this.setState({ opponent: movedPlayer }) : this.setState({ opponentDir: !this.state.opponentDir });
  };

  bounceBall = () => {
    const newState = this.state.ball + this.state.deltaY + this.state.deltaX;

    if (this.touchingEdge(newState)) {
      this.setState({ deltaY: -this.state.deltaY });
    }

    if (this.touchingPaddleEdge(newState)) {
      this.setState({ deltaY: -this.state.deltaY });
    }

    if (this.touchingPaddle(newState)) {
      this.setState({ deltaX: -this.state.deltaX });
    }

    this.setState({ ball: newState });

    if (this.isScore(newState)) {
      if (this.state.deltaX !== -1) {
        this.setState({
          playerScore: this.state.playerScore + 1,
          ball: newState,
        });
      } else {
        this.setState({
          opponentScore: this.state.opponentScore + 1,
          ball: newState,
        });
      }
      this.setState({ pause: true });
      this.resetGame();
    }
  };

  keyInput = ({ keyCode }: KeyboardEvent) => {
    switch (keyCode) {
      // case PLAYER_UP:
      // case PLAYER_DOWN:
      // const movedPlayer = this.moveBoard(this.state.player, keyCode===PLAYER_UP);
      // if (movedPlayer){
      // 	this.setState({player: movedPlayer, pause: false})
      // }
      // break;
      // case OPPONENT_UP:
      // case OPPONENT_DOWN:
      // 	const movedOpp = this.moveBoard(this.state.opponent, keyCode === PLAYER_UP)
      // 	if (movedOpp){
      // 		this.setState({player: movedOpp, pause: false})
      // 	}
      // 	break;
      // case PLAY:
      // 	this.setState({pause: false})
      // 	break;
      case PLAY:
        this.setState({ pause: false });
        break;
      case PAUSE:
        this.setState({ pause: true });
        break;
      default:
        break;
    }
  };

  render() {
    const board = [...Array(ROW_SIZE * COL_SIZE)].map((_, pos) => {
      let val = BACKGROUND;
      if (
        this.state.player.indexOf(pos) !== -1 ||
        this.state.opponent.indexOf(pos) !== -1
      ) {
        val = PLAYER;
      } else if (this.state.ball === pos) {
        val = BALL;
      }
      return <Box key={pos} name={val} />;
    });

    const divider = [...Array(ROW_SIZE / 2 + 2)].map((_) => <div>{"|"}</div>);
    return (
      <div style={outer}>
        <h1>{"PING-PONG"}</h1>
        <div style={inner}>
          <div style={style}>{board}</div>
          <div style={score}>{this.state.playerScore}</div>
          <div style={dividerStyle}>{divider} </div>
          <div style={dividerStyle}>{this.state.opponentScore}</div>
        </div>
        <h3>{"press any key to start/pause"}</h3>
      </div>
    );
  }
}

export default Game;
