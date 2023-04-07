import React, {useState, CSSProperties} from 'react';
import { User } from '../../types';
import RankIcon from '../Rank/RankIcon';

interface Props {
    user: User;
}

const StatElo:React.FC<Props> = ({user}) => {
  
    const StatElo: CSSProperties = {
        flexBasis:'25%', height:'75%', alignSelf:'center',
        background :'rgba(0, 0, 0, 0.7)', borderRadius:'30px',  
        fontWeight:'800', fontSize:'40px', fontFamily:'Montserrat, sans-serif', textAlign:'center', color:'white',
        display:'flex', flexDirection:'column', justifyContent:'space-around',
    }
    const Elo: CSSProperties = {
      marginTop: '-50px', fontSize: '30px',
    }
    const Nbr: CSSProperties = {
      letterSpacing: '5px',
    }

    return (
    <div style={StatElo}>
      <span>GOLD</span>
      <RankIcon user={user} />
      <span style={Elo}>Elo</span>
      <span style={Nbr}>2561</span>
    </div>
  )
}

export default StatElo
