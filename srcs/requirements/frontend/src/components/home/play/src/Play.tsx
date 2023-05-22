// import React, { FC, useState } from 'react'
// import '../css/Play.css'
// import Game from './Game'

// interface PlayProps {
//     changeComponent: (component: string) => void;
// }

// const Play:FC<PlayProps> = ({changeComponent}) => {
//   const [showGame, setShowGame] = useState(false);

//   const handleClick = () => {
//     setShowGame(true);
//   };

//   return (
//     <div className="containerPlay">
//       {!showGame && (
//         <div onClick={handleClick}>
//           <h2 className="playTxt">PLAY</h2>
//           <div className="playButton" />
//         </div>
//       )}
//       {showGame && <Game changeComponent={changeComponent} />}
//     </div>
//   )
// }

// export default Play


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
