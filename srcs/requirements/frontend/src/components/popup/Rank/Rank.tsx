import React from 'react'
import { CSSProperties } from 'react'
import RankEntry from './RankEntry'
import {User} from '../../types'

interface Props {
  user: User;
}

const Rank:React.FC<Props> = ({user}) => {

    const rankContainer: CSSProperties = {
        flexBasis: '1750px',
        height: '600px',
        // border: '3px solid red',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    }

    const rankIcons: CSSProperties = {
      flexBasis: '400px',
      // border: '3px solid blue',
      margin: '20px',

      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
  }

  const Bar: CSSProperties = {
  
    border: '3px solid #fff',
    borderRadius: '30px',
    height: '30px',
    width: 'auto',
  }
  const progress: CSSProperties = {
    height: '30px',
    borderRadius: '30px',

    background: 'linear-gradient(to right, #F45BE2, #29B2FF)',
    width: user.elo > 100 ?  user.elo / 50 + '%' : 100 / 50 + '%',
    
    color: 'white',
    textAlign: 'center',
    fontWeight : '600',
    fontSize : '20px',
    fontFamily: 'montserrat',
    letterSpacing : '5px',

  }

  return (
    <div style={rankContainer}>
        <div style={Bar}>
           <div style={progress}>{
              user.elo > 249 ? <span>{user.elo}</span>: null} </div>
        </div>
        <div style={rankIcons}>
        <RankEntry rank='bronze' elo={0} userLevel={user.rank === 'bronze'} user={user}/>
        <RankEntry rank='silver' elo={1000} userLevel={user.rank === 'silver'} user={user}/>
        <RankEntry rank='gold'  elo={2000} userLevel={user.rank === 'gold'} user={user}/>
        <RankEntry rank='crack' elo={3000} userLevel={user.rank === 'crack'} user={user}/>
        <RankEntry rank='ultime' elo={4000} userLevel={user.rank === 'ultime'} user={user}/>
        </div>
    </div>
  )
}

export default Rank
