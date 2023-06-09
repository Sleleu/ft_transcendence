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
  handleSelect: (id: number, roomName: string, type: string) => void;
  socket?: Socket;
}

const RoomEntry:React.FC<Props> = ({room, handleSelect, socket}) => {

const [owner, setOwner] = useState<string>('');
const [newMsg, setNewMsg] = useState<boolean>(false);

const RoomsContainer: CSSProperties = {
  height:'100px', margin: '7px', color: '#fff', fontSize:'24px',
  border: newMsg ? '1px solid #0f0' : '1px solid #fff',
  // border: '1px solid #fff',
  boxShadow: newMsg ? 'inset 0 0 30px #0a0' : 'null',
  borderRadius: '30px', cursor: 'pointer', display: 'flex', justifyContent: 'space-around',
}
const legend: CSSProperties = {
  fontSize: '18px', fontStyle: 'italic',
}
const Owner: CSSProperties = {
  color:'#ee3388',
}
const Salon: CSSProperties = {
  fontWeight: '600', color:'#00ccdd',
}
const Conversation: CSSProperties = {
  fontWeight: '600', color:'#5ff', fontSize: '36px',
}
const Type: CSSProperties = {
  color: (room.type === 'public') ? '#00ee13'
  : (room.type === 'protected') ? '#eeaa00'
  : '#ff0000',
}
const InSalon: CSSProperties = {
  color:'#ffdd77',
}
const Block: CSSProperties = {
  display: 'flex', flexDirection:'column', justifyContent: 'space-around',
}
const MSG: CSSProperties = {
  height: '40%',
  alignSelf: 'center',
}

useEffect(() => {
  socket?.emit('owner', {roomName: room.name}, (response:User) => {
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
    <div style={RoomsContainer} onClick={() => handleSelect(room.id, room.name, room.type)}>
      {room.type !== 'direct' && <div style={Block}>
      <span style={legend}>Salon Name</span>
        <span style={Salon}>{room.name}</span>
      </div>}
      {room.type !== 'direct' && <div style={Block}>
        <span style={legend}>Owner</span>
        <span style={Owner}>{owner}</span>
      </div>}
      {room.type !== 'direct' && <div style={Block}>
        <span style={legend}>Status</span>
        <span style={Type}>{room.type.toUpperCase()}</span>
      </div>}
      {/* {room.type !== 'direct' && <div style={Block}>
        <span style={legend}>In salon</span>
        <span style={InSalon}>-42</span>
      </div>} */}
      {room.type === 'direct' && <div style={Block}>
        <span style={Conversation}>{room.name}</span>
      </div>}
      {!newMsg && <img src={msgGrey} style={MSG}></img>}
      {newMsg && <img src={msgGreen} style={MSG}></img>}

    </div>
  )
}

export default RoomEntry
