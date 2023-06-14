import React, { FC } from 'react'
import '../css/Game.css'

interface GameOverProps {
    changeComponent: (component: string) => void;
}

const GameOver:FC<GameOverProps> = ({changeComponent}) => {
  
  const click = () => {
    changeComponent('Choices')
  }
  return (
    <div className='containerGameOver' onClick = {click}>
        <h2 className='gameoverText'>Game Over</h2>
        <div className='tryagainButton'/>
    </div>
  )
}

export default GameOver