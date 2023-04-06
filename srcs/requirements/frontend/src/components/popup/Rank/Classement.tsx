import React from 'react'
import { CSSProperties, useState, useEffect } from 'react'
import { User, rankData } from '../../types'
import ClassementEntry from './ClassementEntry'

import bronze from '../../../img/bronzeRank.png'
import silver from '../../../img/silverRank.png'
import gold from '../../../img/goldRank.png'
import crack from '../../../img/crakRank.png'
import ultime from '../../../img/ultimeCrackRank.png'
import Play from '../../home/play/src/Play'

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
    flexBasis: '90%',
    height:'95%',
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
  margin: '0px',

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
    justifyContent: 'space-between',
    marginLeft: '80px',
  }
    const legendText: CSSProperties = {
      flexBasis: '50px',
      marginTop: '10px',
      marginRight: '30px',

      fontWeight : '600',
      fontSize : '24px',
      fontFamily: 'Montserrat, sans-serif',
      color: '#fff',
    }

  const Entries: CSSProperties = {
    flexGrow: '1',
    margin: '5px',
  
    borderRadius: '15px',
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'scroll',
  }

  const [leaders, setLeaders] = useState<rankData[]>([]);

  const fetchHistory = async () => {
    const data = await fetch("http://localhost:5000/leader" ,{ method:"GET" });
    const jsonData = await data.json();
    return jsonData;
  }

  useEffect(() => {
    const getLeaders = async () => {
        const leaderDatabase = await fetchHistory();
        setLeaders(leaderDatabase);
    }
    getLeaders();
  }, [])

  const leadersSorted: rankData[] = leaders.sort((a, b) => b.elo - a.elo);
  leadersSorted.forEach((leader, index) => { leader.rank = index + 1});

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
        {/* MUST SORT LEADERS BY ELO (+ victory + ratio) */}
        {leadersSorted.map((leader) => <ClassementEntry leader={leader} />)}
      </div>
    </div>
  )
}

export default Classement
