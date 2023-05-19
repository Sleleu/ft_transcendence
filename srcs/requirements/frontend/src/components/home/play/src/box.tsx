
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

const backgroundStyle : CSSProperties= {
    height: "35px",
    width: "35px",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor : "black",
    borderRadius: "2px",
}
const playerStyle : CSSProperties = {
    height: "35px",
    width: "35px",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor : "blue",
    color: "white"
}

const ballStyle : CSSProperties = {
    height: "35px",
    width: "35px",
    display: "block",
    backgroundColor: "yellow",
    justifyContent: "center",
    borderRadius: "100%",
    color:"white",
    zIndex: "10",
    position: 'relative'
}

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

