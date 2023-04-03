import React from 'react'
import './Name.css' 
import RankBarUnderName from './RankBarUnderName'

type NameProps = {
  name: string;
  elo: number;
  rank: string;
}

const NamePars = (name: string) => {
  if (name.length > 13)
  {
    return name.slice(0, 10) + '...'
  }
  return name
}

const Name = ({name, elo, rank}: NameProps) => {
  return (
    <div className='containerName'>
      <div className='containerRoseName'>
        <div className='containerTextName'>
          <h1 className='nameText'>{NamePars(name)}</h1>
        </div>
        <RankBarUnderName
        elo={elo}
        rank={rank}
        />
      </div>
      {/* j'ai mute les brush parce que c'est de la merde
      <div className='brushTop'/>
      <div className='brushBot'/> */}
    </div>
  )
}

export default Name