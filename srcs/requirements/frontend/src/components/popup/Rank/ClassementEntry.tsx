import { relative } from 'path'
import React from 'react'
import { CSSProperties, useState } from 'react'
import { rankData } from '../../types'

interface Props {
  leader: rankData;
}

const ClassementEntry:React.FC<Props> = ({leader}) => {

const Entry: CSSProperties = {
    flexBasis: '100px',
    margin: '5px',
    marginLeft: '5px',
    
    background: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '15px',
    
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
}

const entryText: CSSProperties = {
    flexBasis: '250px',
    marginTop: '10px',
    marginLeft: '0px',
    fontWeight : '600',
    fontSize : '24px',
    fontFamily: 'Montserrat, sans-serif',
    color: '#fff',
    textAlign:'right',

    // border: '2px solid red',
  }
  const rank: CSSProperties = {
    flexBasis: '100px',
    marginTop: '10px',
    marginLeft: '30px',
    fontWeight : '600',
    fontSize : '24px',
    fontFamily: 'Montserrat, sans-serif',
    color: '#fff',
    textAlign:'left',

    // border: '2px solid red',
  }

  return (
    <div style={Entry}>
      <span style={rank}>{leader.rank}</span>
      <span style={entryText}> {leader.username} </span>
      <span style={entryText}>{leader.elo}</span>
      <span style={entryText}>{leader.victory}</span>
      <span style={entryText}>{(leader.victory / (leader.victory + leader.defeat) * 100).toFixed(0)}%</span>
    </div>
  )
}

export default ClassementEntry
