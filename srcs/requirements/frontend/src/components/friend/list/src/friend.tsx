import React, { FC } from 'react'
import { useState, useEffect } from 'react';
import '../css/friend.css'
import Play from '../../../home/play/src/Play'
import { User } from '../../../types';

interface FriendProps {
  changeComponent: (component: string) => void;
  token: string;
}

interface FriendInterface {
  id: number;
  createdAt: string;
  userId: number
  friendId: number
  friend: User
}

const Friend: FC<FriendProps> = ({ changeComponent, token }) => {

  const [friend, setFriend] = useState<FriendInterface[]>([])

  const api = async () => {
    const bear = 'Bearer ' + token
    console.log('bear', bear)
    const data = await fetch("http://localhost:5000/friend", { method: "GET", headers: { 'Authorization': bear } })
    const jsonData = await data.json();
    return jsonData;
  }

  useEffect(() => {
    const getUser = async () => {
      const userFromServer = await api()
      setFriend(userFromServer)
    }
    getUser()
  }, [])

  return (
    <div className='containerFriends'>
      <div className='containerLeft'>
        <div className='containerSearchHeader'>
          <div className='containerSearch'>

          </div>
          <div className='containerAddFriend'>

          </div>
        </div>
        <div className='containerFriendBody'>
          <div className='containerFriendBodyLeft'>
            {/* <FriendOnglet /> */}
          </div>
          <div className='containerFriendBodyRight'>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Friend