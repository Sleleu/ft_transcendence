import React from 'react'
import { CSSProperties } from 'styled-components';

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
}

const RoomEntry:React.FC<Props> = ({room, handleSelect}) => {

const RoomsContainer: CSSProperties = {
  margin: '7px',
  color: '#fff', fontSize:'18px',
  border: '1px solid white', borderRadius: '30px',
  cursor: 'pointer',
  display: 'flex', justifyContent: 'space-around',
}
const legend: CSSProperties = {
  fontSize: '14px', fontStyle: 'italic',
}
const Owner: CSSProperties = {
  color:'#ee3388',
}
const Salon: CSSProperties = {
  fontWeight: '600', color:'#00ccdd',
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
  return (
    <div style={RoomsContainer} onClick={() => handleSelect(room.id, room.name, room.type)}>
      <div style={Block}>
      <span style={legend}>Salon Name</span>
        <span style={Salon}>{room.name}</span>
      </div>
      <div style={Block}>
        <span style={legend}>Owner</span>
        <span style={Owner}>ownerNameHere</span>
      </div>
      <div style={Block}>
        <span style={legend}>Status</span>
        <span style={Type}>{room.type.toUpperCase()}</span>
      </div>
      <div style={Block}>
        <span style={legend}>In salon</span>
        <span style={InSalon}>-42</span>
      </div>
    </div>
  )
}

export default RoomEntry
