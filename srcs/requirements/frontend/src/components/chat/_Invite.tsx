import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';
import { User } from '../types';
import InviteEntry from './_InviteEntry';

interface Props {
    socket: Socket | undefined;
    roomName: string;
    whitelist: User[];
    confirmScreen: (what: string, message: string, id?: number) => void;
}

interface FriendInterface {
    id: number;
    createdAt: string;
    userId: number
    friendId: number
    friend: User
  }

const Invite:React.FC<Props> = ({socket, roomName, whitelist, confirmScreen}) => {

    const [searchFriend, setSearchFriend] = useState<FriendInterface[]>([])

    const InviteStyle: CSSProperties = {color: '#fff', alignSelf: 'center', display:'flex', flexDirection:'column',}
    const title: CSSProperties = {fontSize: '24px', fontWeight:'800', padding: '10px',}
    const entries: CSSProperties = {fontSize: '26px', fontWeight:'600', padding: '10px', alignSelf:'center', cursor: 'pointer'}

    const sortFriend = (friend: FriendInterface[]) => {
        return friend.sort((a, b) => (a.friend.state !== 'offline' ? -1 : 1))
      }
    
    useEffect(() => {
        socket?.emit('getFriend', {}, (response: FriendInterface[]) => {
            setSearchFriend(sortFriend(response));
          })
    }, []);

    const filteredFriends = searchFriend.map((friend) => friend.friend).filter((user) => !whitelist.some((whitelistedUser) => whitelistedUser.id === user.id));

    return (
        <div style={InviteStyle}>
            <span style={title}>INVITE</span>
            <div style={entries}>
            {filteredFriends.map((friend) => <InviteEntry socket={socket} friend={friend} roomName={roomName} confirmScreen={confirmScreen}/>)}
            </div>
    </div>
  )
}

export default Invite
