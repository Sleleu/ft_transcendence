import React, { useState, useEffect, CSSProperties } from 'react';
import StatVictory from './Stats/StatVictory';
import StatElo from './Stats/StatElo';
import StatMatch from './Stats/StatMatch';
import { getPublicUserInfo } from '../Api';
import { PublicUserInfo } from '../types';

interface PublicProfileProps {
  profileId: string | number;
  changeComponent: (component: string) => void;
}

const PublicProfile: React.FC<PublicProfileProps> = ({profileId, changeComponent}) => {

  const [profile, setProfile] = useState<PublicUserInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const intProfileId = parseInt(profileId.toString(), 10);
            const userInfo = await getPublicUserInfo(intProfileId);
            setProfile(userInfo);
        } catch (error) {
            console.error(error);
        }
    };
    fetchData();
  }, [profileId]);

  const Container: CSSProperties = {
    position: 'relative', flexGrow: 1, height: '90%',
    margin: '30px', marginBottom: '55px', 
    border: '4px solid #40DEFF', boxShadow: '0 0 10px #40DEFF, 0 0 60px #40DEFF, inset 0 0 40px #40DEFF',
    display: 'flex', flexDirection: 'row', justifyContent: 'space-around',
  }

  return (
    <div style={Container}>
        {profile && <StatVictory profile={profile}/>}
      {profile ? <div>{profile.gameLogin}</div> : <div className='text bold'>Loading...</div>}
    </div>
  )
}

export default PublicProfile;
