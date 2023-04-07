import React from 'react'
import '../css/Name.css' 
import RankBarUnderName from './RankBarUnderName'

type NameProps = {
  name: string;
  elo: number;
  rank: string;
  changeComponent: (component: string) => void;
}

const Name = ({name, elo, rank, changeComponent}: NameProps) => {

  let size: number = 32

  const calculSize = (size:string) => {
    if (size.length < 9)
      return 20
    if (size.length < 12)
      return 12
    if (size.length > 6)
      return 8
    return 32
  }

  const nameSize = {
    fontSize: `calc(${calculSize(name)}px + 1.5vh)`
  }

  const NamePars = (name: string) => {
    if (name.length > 13)
      return name.slice(0, 10) + '...'
    return name
  }

  return (
    <div className='containerName'>
      <div className='containerRoseName'>
        <div className='containerTextName'>
          <h1 className='nameText' style={nameSize}>{NamePars(name)}</h1>
        </div>
        <RankBarUnderName
        elo={elo}
        rank={rank}
        changeComponent={changeComponent}
        />
      </div>
    </div>
  )
}

export default Name