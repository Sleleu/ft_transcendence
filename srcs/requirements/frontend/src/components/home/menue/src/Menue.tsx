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
                <div className='containerFriend'>
                    <div className='friendLogo' />
                    <h3 className='friendTxt'>friends</h3>
                </div>
                <div className='containerStat'>
                    <div className='statLogo' />
                    <h3 className='statTxt'>stat</h3>
                </div>
                <div className='containerLeader'>
                    <div className='leaderLogo' />
                    <h3 className='leaderTxt'>Leader</h3>
                </div>
            </div>
            <div className='containerBot'>
                <div className='containerSettings'>
                    <div className='settingsLogo' />
                    <h3 className='settingsTxt'>settings</h3>
                </div>
                <div className='containerChat'>
                    <div className='chatLogo' />
                    <h3 className='chatTxt'>chat</h3>
                </div>
                <div className='containerHistoric'>
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