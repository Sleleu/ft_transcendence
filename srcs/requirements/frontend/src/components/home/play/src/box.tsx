
import React, { CSSProperties} from 'react';

interface BoxProps {
    name: number;
    mode: string;
    watch: boolean;
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

  const backgroundStyleBonus: CSSProperties = {
    height: "2vh",
    width: "2vh",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
};


  const playerStyleNormal: CSSProperties = {
    height: "2vh",
    width: "2vh",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor: "white",
    color: "white",
    margin: "-4px",
  };

  const playerStyleBonus: CSSProperties = {
    height: "2vh",
    width: "2vh",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor: "#ff00f2",
    color: "#ff00f2",
    margin: "-4px",
	padding: "5px",
	boxShadow: "0 0 10px #ff00f2, 0 0 20px #ff00f2",
	transition: "boxShadow 0.3s ease"
  };

  const ballStyleNormal: CSSProperties = {
    height: "3vh",
    width: "3vh",
    display: "block",
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: "100%",
    color: "white",
    zIndex: "10",
    position: "relative",
  };

  const ballStyleBonus: CSSProperties = {
    height: "3vh",
    width: "3vh",
    display: "block",
    backgroundColor: "cyan",
    justifyContent: "center",
    borderRadius: "100%",
    color: "white",
    zIndex: "10",
    position: "relative",
	boxShadow: "0 0 10px cyan, 0 0 20px cyan",
  };

const getStyle = (val: number, mode: string, watchmode: boolean) =>{
	if (val === BACKGROUND && (mode === "n" || watchmode)){
		return {};
	}
	else if (val === BACKGROUND && (mode === "b" || watchmode))
		return backgroundStyleBonus;
	if (val === PLAYER && (mode === "n" || watchmode))
		return playerStyleNormal;
	else if (val === PLAYER && (mode === "b" || watchmode))
    	return playerStyleBonus;
  	else if (val === BALL && (mode === "n" || watchmode))
		return ballStyleNormal;
	else
		return ballStyleBonus;
}

const Box = (props : BoxProps) => <div style={backgroundStyle}>
						<div style={getStyle(props.name, props.mode, props.watch)}></div>
					</div>
export default Box;
