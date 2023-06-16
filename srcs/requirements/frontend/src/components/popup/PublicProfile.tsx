import React, {useState, useEffect, CSSProperties} from 'react';
import { User } from '../types';
import StatVictory from './Stats/StatVictory';
import StatElo from './Stats/StatElo';
import StatMatch from './Stats/StatMatch';

interface PublicProfileProps {
    profileid: string | number;
    changeComponent: (component: string) => void;

}

const PublicProfile: React.FC<PublicProfileProps> = ({profileid, changeComponent}) => {

    const Container: CSSProperties = {
        position: 'relative', flexGrow: 1, height: '90%',
        margin: '30px', marginBottom: '55px', 
        border: '4px solid #40DEFF', boxShadow: '0 0 10px #40DEFF, 0 0 60px #40DEFF, inset 0 0 40px #40DEFF',
        display: 'flex', flexDirection: 'row', justifyContent: 'space-around',
    }

    // const testUser:User = {username: 'gmansuy', id: 3, elo: 1678};

  return (
    <div style={Container}>
        <>{profileid}</>
    </div>
  )
}

export default PublicProfile
