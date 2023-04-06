import React from 'react'
import { CSSProperties, useState } from 'react'
import { User } from '../../types'
import ClassementEntry from './ClassementEntry'

import bronze from '../../../img/bronzeRank.png'
import silver from '../../../img/silverRank.png'
import gold from '../../../img/goldRank.png'
import crack from '../../../img/crakRank.png'
import ultime from '../../../img/ultimeCrackRank.png'

interface Props {
  rank : string;
}

const Classement:React.FC<Props> = ({rank}) => {

  let gradient: string;
  switch (rank) {
      case 'bronze':
          gradient = 'linear-gradient(to bottom, #741010, #CC9C1F, #000) 1';
          break;
      case 'silver':
          gradient = 'linear-gradient(to bottom, #FFF, #86CFCB, #000) 1';
          break;
      case 'gold':
          gradient = 'linear-gradient(to bottom, #F3CA37, #D26637, #000) 1';
          break;
      case 'crack':
          gradient = 'linear-gradient(to bottom, #BB7DD9, #9409AA, #000) 1';
          break;
      case 'ultime':
          gradient = 'linear-gradient(to bottom, #FFF, #D26637, #000) 1';
          break;
      default:
          gradient = 'linear-gradient(to bottom, #F3CA37, #EFA81F, #000) 1';
          break;
  }

  const Classement: CSSProperties = {
    flexGrow: '1',
    height:'100%',
    margin: '5px',

    background: 'rgba(0, 0, 0, 0.6)',
    border: '4px solid',
    borderImage: gradient,
    borderRadius: '15px',
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',

}

const Header: CSSProperties = {
  flexBasis: '150px',
  margin: '5px',

  background: 'rgba(0, 0, 0, 0.9)',
  borderRadius: '15px',
  
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',

}
  const goldPic: CSSProperties = {
    height: '250px',
    width: '190px',
    alignSelf: 'center',
    margin: '-45px',
  }
  const headerTitle: CSSProperties = {
    alignSelf: 'center',

    fontWeight : '800',
    fontSize : '64px',
    fontFamily: 'Montserrat, sans-serif',
    letterSpacing : '5px',

    background: gradient.substring(0, gradient.length - 2),
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }
  const headerElo: CSSProperties = {
    alignSelf: 'center',
    marginTop: '10px',
    borderRadius: '15px',

    fontWeight : '800',
    fontSize : '24px',
    fontFamily: 'Montserrat, sans-serif',
    letterSpacing : '5px',

    background: gradient.substring(0, gradient.length - 2),
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  const Legend: CSSProperties = {
    flexBasis: '50px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: '20px',
  }
    const legendText: CSSProperties = {
      flexBasis: '50px',
      marginTop: '10px',
      marginRight: '110px',

      fontWeight : '600',
      fontSize : '24px',
      fontFamily: 'Montserrat, sans-serif',
      color: '#fff',
    }

  const Entries: CSSProperties = {
    flexGrow: '1',
    margin: '5px',
  
    background: 'rgba(255, 0, 0, 0.3)',
    borderRadius: '15px',
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  }

  return (
    <div style={Classement}>
      <div style={Header}>
        <img src={gold} alt='gold' style={goldPic}/>  
        <span style={headerTitle}>{rank.toLocaleUpperCase()}</span>
        <span style={headerElo}>ELO 2000 - 3000</span>
      </div>
      <div style={Legend}>
        <span style={legendText}>RANK</span>
        <span style={legendText}>USER</span>
        <span style={legendText}>ELO</span>
        <span style={legendText}>VICTORY</span>
        <span style={legendText}>RATIO</span>
      </div>
      <div style={Entries}>
        <ClassementEntry />
      </div>
    </div>
  )
}

export default Classement
