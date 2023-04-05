import React from 'react'
import { CSSProperties } from 'react'
import RankEntry from './RankEntry'

const Rank = () => {

    const rankContainer: CSSProperties = {
        flexBasis: '1750px',
        height: '600px',
        border: '3px solid red',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    }

    const rankIcons: CSSProperties = {
        flexBasis: '400px',
        border: '3px solid blue',
        margin: '20px',

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }

  return (
    <div style={rankContainer}>
        <div style={rankIcons}>
        <RankEntry rank='bronze' />
        <RankEntry rank='silver' />
        <RankEntry rank='gold' userLevel={true} />
        <RankEntry rank='crack' />
        <RankEntry rank='ultime' />
        </div>
    </div>
  )
}

export default Rank
