import React from 'react'
import { CSSProperties } from 'react'
import bronze from '../../../img/bronzeRank.png'
import silver from '../../../img/silverRank.png'
import gold from '../../../img/goldRank.png'
import crack from '../../../img/crakRank.png'
import ultime from '../../../img/ultimeCrackRank.png'
import titleBronze from '../../../img/ranks/BRONZE.png'
import titleSilver from '../../../img/ranks/SILVER.png'
import titleGold from '../../../img/ranks/GOLD.png'
import titleCrack from '../../../img/ranks/CRACK.png'
import titleUltime from '../../../img/ranks/ULTIME.png'
import '../Font.css'

interface Props {
    rank: string;
    userLevel?: boolean;
}

const RankEntry:React.FC<Props> = ({rank, userLevel=false}) => {
  
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

    const rankContainer: CSSProperties = {
        flexBasis: '200px',
        height: userLevel ? '400px' : '250px',
        margin: '5px',
        marginTop: userLevel ? '80px' : '120px',

        background: 'rgba(0, 0, 0, 0.9)',
        
        border: '4px solid',
        borderImage: gradient,
        borderRadius: '15px',
        
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    }
    
    const rankElo: CSSProperties = {
        alignSelf: 'center',
        marginTop: '-35px',

        fontWeight : '800',
        fontSize : '36px',
        fontFamily: 'montserrat',
        letterSpacing : '5px',

        background: gradient.substring(0, gradient.length - 2),
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    }

    const bronzePic: CSSProperties = {
        height: '250px',
        width: '170px',
        alignSelf: 'center',
        marginTop: '-5px',
        paddingRight: '5px',
    }
    const silverPic: CSSProperties = {
        height: '250px',
        width: '140px',
        alignSelf: 'center',
        marginTop: '-5px',
        paddingRight: '5px',
    }
    const goldPic: CSSProperties = {
        height: '250px',
        width: '190px',
        alignSelf: 'center',
        marginTop: '-5px',
        paddingRight: '5px',
    }
    const crackPic: CSSProperties = {
        height: '230px',
        width: '155px',
        alignSelf: 'center',
        marginTop: '20px',
        paddingRight: '5px',
    }
    const ultimePic: CSSProperties = {
        height: '200px',
        width: '220px',
        alignSelf: 'center',
        marginTop: '35px',
        paddingRight: '5px',
    }

    const title: CSSProperties = {
        height: '100px',
        width: '280px',
        alignSelf: 'center',
    }

    return (
    <div style={rankContainer}>
        {rank === 'bronze' && <img src={bronze} alt='bronze' style={bronzePic}/>}
        {rank === 'silver' && <img src={silver} alt='silver' style={silverPic}/>}
        {rank === 'gold' && <img src={gold} alt='gold' style={goldPic}/>}
        {rank === 'crack' && <img src={crack} alt='crack' style={crackPic}/>}
        {rank === 'ultime' && <img src={ultime} alt='ultime' style={ultimePic}/>}
        <span style={rankElo}>2000</span>
    </div>
  )
}

export default RankEntry
