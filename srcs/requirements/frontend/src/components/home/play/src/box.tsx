
import React, { CSSProperties} from 'react';

interface BoxProps {
    name: number;
  }

const BACKGROUND = 0;
const PLAYER = 1;
const BALL = 2;

export {
    BACKGROUND,
    PLAYER,
    BALL,
}
const backgroundStyle: CSSProperties = {
    height: "2vh",
    width: "2vh",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor: "black",
  };

  const playerStyle: CSSProperties = {
    height: "2vh",
    width: "2vh",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor: "blue",
    color: "blue",
    margin: "-4px",
  };

  const ballStyle: CSSProperties = {
    height: "3vh",
    width: "3vh",
    display: "block",
    backgroundColor: "yellow",
    justifyContent: "center",
    borderRadius: "100%",
    color: "white",
    zIndex: "10",
    position: "relative",
  };


const getStyle = (val: number) =>{
	if (val === BACKGROUND){
		return {};
	} if (val === PLAYER){
		return playerStyle;
	} else {
		return ballStyle;
	}
}

const Box = (props : BoxProps) => <div style={backgroundStyle}>
						<div style={getStyle(props.name)}></div>
					</div>
export default Box;

