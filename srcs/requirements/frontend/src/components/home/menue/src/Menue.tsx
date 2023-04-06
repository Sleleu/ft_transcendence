import React, { FC } from 'react'
import '../css/Menue.css'
import Play from '../../play/src/Play'

interface MenueProps {
    changeComponent: (component: string) => void;
}

const Menue:FC<MenueProps> = ({changeComponent}) => {
  return (
    <div className='containerMenue'>
        <div className='containerLeftMenue'>
            <div className='containerTop'>
                <div 
                className='containerFriend'
                onClick={() => changeComponent('friend')}
                >
                    <div className='friendLogo' />
                    <h3 className='friendTxt'>friends</h3>
                </div>
                <div className='containerStat'
                onClick={() => changeComponent('stat')}
                >
                    <div className='statLogo' />
                    <h3 className='statTxt'>stat</h3>
                </div>
                <div className='containerLeader'
                onClick={() => changeComponent('leader')}
                >
                    <div className='leaderLogo' />
                    <h3 className='leaderTxt'>Leader</h3>
                </div>
            </div>
            <div className='containerBot'>
                <div className='containerSettings'
                onClick={() => changeComponent('settings')}
                >
                    <div className='settingsLogo' />
                    <h3 className='settingsTxt'>settings</h3>
                </div>
                <div className='containerChat'
                onClick={() => changeComponent('chat')}
                >
                    <div className='chatLogo' />
                    <h3 className='chatTxt'>chat</h3>
                </div>
                <div className='containerHistoric'
                onClick={() => changeComponent('historic')}
                >
                    <div className='historicLogo' />
                    <h3 className='historicTxt'>historic</h3>
                </div>
            </div>
        </div>
        <Play changeComponent={changeComponent}/>
    </div>
  )
}

export default Menue