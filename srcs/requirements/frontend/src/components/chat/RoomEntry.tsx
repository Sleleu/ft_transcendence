import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client';
import { CSSProperties } from 'styled-components';
import { User } from '../types';
import msgGrey from '../../img/msgGrey.png'
import msgGreen from '../../img/msgGreen.png'

interface MessageObj {
  id: number;
  name: string;
  text: string;
  roomId: number;
}

interface Room {
    name: string;
    id: number;
    type: string;
    owner?: string;
    inSalon?: string;
}

interface Props {
	room: Room;
	key: number;
  handleSelect: (id: number, roomName: string, type: string, owner: string) => void;
  socket?: Socket;
}

const RoomEntry:React.FC<Props> = ({room, handleSelect, socket}) => {

const [owner, setOwner] = useState<string>('');
const [newMsg, setNewMsg] = useState<boolean>(false);

const RoomsContainer: CSSProperties = {
  // border: newMsg ? '1px solid #0f0' : '1px solid #fff',
  boxShadow: newMsg ? 'inset 0 0 30px #0a0' : 'null',
}
const Type: CSSProperties = {
  color: (room.type === 'public') ? '#00ee13'
  : (room.type === 'protected') ? '#eeaa00'
  : '#ff0000',
}

const Block: CSSProperties = {
  display: 'flex', flexDirection:'column', justifyContent: 'space-around',
}

useEffect(() => {
  socket?.emit('owner', {roomId: room.id}, (response:User) => {
    setOwner(response.username);
  })

  socket?.on('newMessage', (message: MessageObj) => {
    if (message.roomId === room.id)
      setNewMsg(true);
  })
  socket?.on('joinSuccess', (response) => {
    if (response.id === room.id)
      setNewMsg(false);
    })
}, []);

  return (
    <div className='RoomBox' style={RoomsContainer} onClick={() => handleSelect(room.id, room.name, room.type, owner)}>
      {room.type !== 'direct' && <div style={Block}>
      <span className='legend'>Salon Name</span>
        <span className='salon'>{room.name}</span>
      </div>}
      {room.type !== 'direct' && <div style={Block}>
        <span className='legend'>Owner</span>
        <span className='ownerTxt'>{owner}</span>
      </div>}
      {room.type !== 'direct' && <div style={Block}>
        <span className='legend'>Status</span>
        <span style={Type}>{room.type.toUpperCase()}</span>
      </div>}
      {room.type === 'direct' && <div style={Block}>
        <span>{room.name}</span>
      </div>}
      {!newMsg && <img src={msgGrey} className='iconMsg'></img>}
      {newMsg && <img src={msgGreen} className='iconMsg'></img>}

    </div>
  )
}

export default RoomEntry
