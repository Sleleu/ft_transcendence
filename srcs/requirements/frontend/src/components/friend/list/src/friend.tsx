import React, { FC } from 'react'
import { useState, useEffect } from 'react';
import '../css/friend.css'
import Play from '../../../home/play/src/Play'

interface FriendProps {
  changeComponent: (component: string) => void;
}

const Friend: FC<FriendProps> = ({ changeComponent }) => {

  // const [activeComponent.]

  return (
    <div className='containerFriends'>
      <div className='containerLeft'>
        <div className='containerSearchHeader'>
          <div className='containerSearch'>

          </div>
          <div className='containerAddFriend'>

          </div>
        </div>
        <div>
          {/* <FriendOnglet /> */}
        </div>
      </div>
      {/* <Play changeComponent={changeComponent}/> */}
    </div>
  )
}

export default Friend