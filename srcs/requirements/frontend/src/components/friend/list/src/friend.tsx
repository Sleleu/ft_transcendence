import React, { FC } from 'react'
import { useState, useEffect } from 'react';
import '../css/friend.css'
import Play from '../../../home/play/src/Play'
import { User } from '../../../types';
import FriendOnglet from './FriendOnglet';
import FriendAdd from './FriendAdd';

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
  const [searchText, setSearchText] = useState<string>('')
  const [searchFriend, setSearchFriend] = useState<FriendInterface[]>([])
  const [component, setComponent] = useState<string>('add')

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
      setSearchFriend(sortFriend(userFromServer))
    }
    getUser()
  }, [])

  const sortFriend = (friend: FriendInterface[]) => {
    return friend.sort((a, b) => (a.friend.state !== 'offline' ? -1 : 1))
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase()
    console.log('value = ', value)
    setSearchText(value)
    const filteredFriends = friend.filter((friend) => friend.friend.username.toLowerCase().startsWith(value))
    const sortedFriend = filteredFriends.sort((a, b) => (a.friend.state !== 'offline' ? -1 : 1))
    setSearchFriend(sortedFriend)
  }

  const changeComponentFriend = (compo: string) => {
    setComponent(compo)
  }


  return (
    <div className='containerFriends'>
      <div className='containerLeft'>
        <div className='containerSearchHeader'>
          <div className='containerSearch'>
            <input className='inputFriend' type='text' value={searchText} onChange={handleSearch} placeholder='FriendName' />
            <div className='loopButton' />
          </div>
          <div className='containerAddFriend'>
            <div className='addFriendLogo' />
          </div>
        </div>
        <div className='containerFriendBody'>
          <div className='containerFriendBodyLeft'>
            {searchFriend.map((friend) =>
              <FriendOnglet key={friend.id} friend={friend.friend} />
            )}
          </div>
          <div className='containerFriendBodyRight'>
            <FriendAdd />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Friend