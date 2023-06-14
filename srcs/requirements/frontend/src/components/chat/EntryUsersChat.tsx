import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';
import { User } from '../types';
import './ChatRoom.css'
import {ChatRoomData} from './chatTypes';

interface Props {
    socket: Socket | undefined;
	user: User;
	target: User;
	field: string;
	changeComponent: (component: string) => void;
	handleUserClick: (target: User, event: React.MouseEvent<HTMLSpanElement>) => void;
}

// const sortFriend = (friend: FriendInterface[]) => {
//     return friend.sort((a, b) => (a.friend.state !== 'offline' ? -1 : 1))
//   }
// const filteredFriends = searchFriend.map((friend) => friend.friend).filter((user) => !whitelist.some((whitelistedUser) => whitelistedUser.id === user.id));

const EntryUsersChat:React.FC<Props> = ({socket, user, target, field, changeComponent, handleUserClick}) => {

    useEffect(() => {

    }, []);



    return (
        <div className='EntryUser' onClick={(e) => handleUserClick(target, e)}>
			{target.gameLogin}

	    </div>

  )
}

export default EntryUsersChat
