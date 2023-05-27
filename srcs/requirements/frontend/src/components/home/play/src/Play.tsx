import React, { FC } from 'react'
import '../css/Play.css'

interface PlayProps {
    changeComponent: (component: string) => void;
}

const Play:FC<PlayProps> = ({changeComponent}) => {

  const handleClick = () => {
    changeComponent("game");
  };

  return (
    <div className='containerPlay' onClick={handleClick}>
        <h2 className='playTxt'>PLAY</h2>
        <div className='playButton' />
    </div>
  )
}

export default Play
