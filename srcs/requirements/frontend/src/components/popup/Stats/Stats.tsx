import React, {useState, useEffect, CSSProperties} from 'react';
import { User } from '../../types';
import StatVictory from './StatVictory';
import StatElo from './StatElo';
import StatMatch from './StatMatch';

interface Props {
    user: User;
}

const Stats: React.FC<Props> = ({user}) => {

    const Container: CSSProperties = {
        position: 'relative', flexGrow: 1, height: '90%',
        margin: '30px', marginBottom: '55px', 
        border: '4px solid #40DEFF', boxShadow: '0 0 10px #40DEFF, 0 0 60px #40DEFF, inset 0 0 40px #40DEFF',
        display: 'flex', flexDirection: 'row', justifyContent: 'space-around',
    }

  return (
    <div style={Container}>
        <StatVictory user={user}/>
        <StatElo user={user}/>
        <StatMatch user={user}/>
    </div>
  )
}

export default Stats
