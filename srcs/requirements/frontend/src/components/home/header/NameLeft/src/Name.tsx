import React from 'react'
import '../css/Name.css'
import RankBarUnderName from './RankBarUnderName'
import { User } from '../../../../types'


const Name = ({ user, changeComponent }: { user: User, changeComponent: (component: string) => void }) => {

  let size: number = 32

  const calculSize = (size: string) => {
    if (size.length < 9)
      return 20
    if (size.length < 12)
      return 12
    if (size.length > 6)
      return 8
    return 32
  }

  const nameSize = {
    fontSize: `calc(${calculSize(user.username)}px + 1.5vh)`
  }

  const NamePars = (name: string) => {
    if (name.length > 13)
      return name.slice(0, 10) + '...'
    return name
  }

  const calculRank = (elo: number) => {
    if (elo < 1000)
      return "bronze"
    else if (elo < 2000)
      return "silver"
    else if (elo < 3000)
      return "gold"
    else if (elo < 4000)
      return "crack"
    else
      return "ultimeCrack"
  }

  return (
    <div className='containerName'>
      <div className='containerRoseName'>
        <div className='containerTextName'
          onClick={() => changeComponent('stat')}
        >
          <h1 className='nameText' style={nameSize}>{NamePars(user.username)}</h1>
        </div>
        <RankBarUnderName
          elo={user.elo}
          rank={calculRank(user.elo)}
          changeComponent={changeComponent}
        />
      </div>
    </div>
  )
}

export default Name