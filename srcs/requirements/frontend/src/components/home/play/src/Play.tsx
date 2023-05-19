import React, { FC, useState } from 'react'
import '../css/Play.css'
import Game from './Game'

interface PlayProps {
    changeComponent: (component: string) => void;
}

const Play:FC<PlayProps> = ({changeComponent}) => {

  const [isGameVisible, setIsGameVisible] = useState(false);

  const handlePlayClick = () => {
    setIsGameVisible(true);
    changeComponent("Game");
  };
  return (
    <div className="containerPlay">
          {!isGameVisible && (
            <>
              <h2 className="playTxt">PLAY</h2>
              <div className="playButton" onClick={handlePlayClick} />
            </>
          )}
          {isGameVisible && <Game />}
    </div>
  )
}

export default Play
