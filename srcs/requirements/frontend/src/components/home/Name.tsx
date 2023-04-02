import React from 'react'
import './Name.css' 

type NameProps = {
  name: string;
  elo: number;
  rank: string;
}

const Name = ({name, elo, rank}: NameProps) => {
  return (
    <div className='containerName'>
      <div className='containerRoseName'>
        <div className='containerTextName'>
          {/* <h1 className='nameText'>{name}</h1> */}
          <h1 className='nameText'>gottieeeeeeeeeeeee</h1>
        </div>
      </div>
      {/* j'ai mute le css des brush parce que c'est de la merde */}
      <div className='brushTop'/>
      <div className='brushBot'/>
    </div>
  )
}

export default Name