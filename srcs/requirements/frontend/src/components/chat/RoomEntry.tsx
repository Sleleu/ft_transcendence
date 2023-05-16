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

const RoomsStyle: CSSProperties = {
    alignSelf: 'center', margin : '5px', padding: '10px',
    color: '#fff',
    border: '1px solid white',
	borderRadius: '30px',
}

  return (
    <div style={RoomsStyle} onClick={() => handleSelect(room.id, room.name, room.type)}>
      {room.name}
    </div>
  )
}

export default RoomEntry
