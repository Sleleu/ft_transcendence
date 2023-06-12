import React from 'react'
import { Socket } from 'socket.io-client';
import { User } from '../types';

interface Props {
    socket: Socket | undefined;
    friend: User;
    roomName: string;
    confirmScreen: (what: string, message: string, id?: number) => void;
}


const InviteEntry:React.FC<Props> = ({socket, friend, roomName, confirmScreen}) => {
  return (
    <div onClick={() => confirmScreen('add', `Do you want to add ${friend.username} to the room ?`, friend.id)}>
      {friend.username}
    </div>
  )
}

export default InviteEntry
