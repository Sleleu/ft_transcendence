import React, { CSSProperties, useState } from 'react'
import { Socket } from 'socket.io-client';
import { User } from '../types';

interface Room {
    name: string;
    id: number;
    type: string;
}

interface Props {
    socket: Socket | undefined;
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
    setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
}

const CreateRoom:React.FC<Props> = ({socket, setRooms, setCreateRoom, user}) => {

    const CreateRoomStyle: CSSProperties = {
        display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignContent: 'center',
        alignSelf: 'center',
    }
    const FormStyle: CSSProperties = {
        display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignContent: 'center',

        padding: '20px',
    }
    const RoomTypeStyle: CSSProperties = {
        color: 'white',
        padding: '10px',
    }

    const [roomText, setRoomText] = useState<string>("");
    const [checkbox, setCheckbox] = useState<string>("public");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomText)
            return ;
        if (checkbox === 'protected' && !password)
            return ;
        socket?.emit('createRoom', { name:roomText, type:checkbox, password:password,},
        (response: Room) => {
            setRoomText("");
            setCreateRoom(false);
        })
    }
    const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomText(event.target.value);
    };
    const handlePassTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const handleCheckboxChange = (type: string) => {
        setCheckbox(type);
    };

    return (
    <div style={CreateRoomStyle}>
        <button onClick={() => setCreateRoom(false)}>Return</button>
        <form style={FormStyle} onSubmit={handleSubmit}>
            <input value={roomText} onChange={handleTyping} placeholder='Room Name'></input>
            <div style={RoomTypeStyle}><input type='checkbox' checked={checkbox === 'public'} onChange={() => handleCheckboxChange('public')}></input>PUBLIC</div>
            <div style={RoomTypeStyle}><input type='checkbox' checked={checkbox === 'private'} onChange={() => handleCheckboxChange('private')}></input>PRIVATE</div>
            <div style={RoomTypeStyle}><input type='checkbox' checked={checkbox === 'protected'} onChange={() => handleCheckboxChange('protected')}></input>PROTECTED</div>
            {checkbox === 'protected' ?
            <input value={password} onChange={handlePassTyping} placeholder='Password'></input>
            : null}
            <button>CREATE ROOM</button>
        </form>
    </div>
  )
}

export default CreateRoom
