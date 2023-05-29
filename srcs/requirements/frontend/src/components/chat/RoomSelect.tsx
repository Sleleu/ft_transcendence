import React, {useState, useEffect, useRef} from 'react'
import { CSSProperties } from 'react'
import Chat from './Chat';
import { io, Socket } from 'socket.io-client';
import CreateRoom from './CreateRoom';
import { User } from '../types';
import Room from './RoomEntry';
import RoomEntry from './RoomEntry';
import retLogo from '../../img/navBar/returnLogo.png'
import firendLogo from '../../img/menue/friend.png'

interface Room {
    name: string;
    id: number;
    type: string;
    owner?: string;
    inSalon?: string;
}

interface Props {
    user: User;
    socket?: Socket;
}

const RoomSelect:React.FC<Props> = ({user, socket}) => {

    const username = user.username;
    const [rooms, setRooms] = useState<Room[]>([]);
    const [hover, setHover] = useState<boolean>(false);

    const [currentRoom, setCurrentRoom] = useState<number>(-1);
    const [roomName, setRoomName] = useState<string>("");

    const [createRoom, setCreateRoom] = useState<boolean>(false);

    useEffect(() => {
        socket?.emit('findAllRooms', {}, (response: Room[]) => setRooms(response));
        socket?.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });
    
        socket?.on('connect_error', (error) => {
            console.log('Connection error:', error);
        });

    }, []);

    const handleConnect = () => {
        socket?.emit('connectToChat', {name: username}, () => {})
    }

    // socket?.on('connect', () => {
    //     handleConnect();
    //     console.log('Connected to Socket.IO server');
    // });


    const Container: CSSProperties = {
        width: '90%',
        height:'95%',
        margin: '5px',

        background: 'rgba(0, 0, 0, 0.6)',
        border: '4px solid',
        borderRadius: '15px',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    }
    const middleBlock: CSSProperties = {
        width: '98%',
        height:'90%',
        margin: '5px',

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
    const leftBlock: CSSProperties = {
        width: '70%',
        height:'95%',
        margin: '5px',

        // backgroundColor: 'red',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    }
    const navBarChat: CSSProperties = {
        height:'10%',

        // backgroundColor: 'red',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    }

    const displayBox: CSSProperties = {
        width: '90%', height: '80%',
        margin: '10px',
        padding: '20px',
        borderRadius: '30px',
        border: '2px solid #fff', backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column', justifyContent: 'center',
        overflow: 'auto',
    }
    const buttons: CSSProperties = {
        width: '20%', height : '80%',
        borderRadius: '30px', alignSelf: 'center',
        border: '2px solid #fff', backgroundColor: '#000',
        color: '#fff', fontWeight: '800', fontSize: '18px',
        cursor: 'pointer',
    }
    const returnButton: CSSProperties = {
        width: '10%', height : '80%',
        borderRadius: '30px', alignSelf: 'center',
        border: '2px solid #fff', backgroundColor: '#000',
        color: '#fff', fontWeight: '800', fontSize: '18px',
        cursor: 'pointer',
    }
    const returnLogo : CSSProperties = {
        marginLeft: '30%',
        marginTop: '10px',
        width: '35%',
        minWidth:'33px',
    }
    const friendLogo : CSSProperties = {
        marginLeft: '27%',
        marginTop: '10px',
        width: '35%',
        minWidth:'33px',
    }

    const handleSelect = (id: number, roomName: string, type: string) => {
        //Si type === protected, demande un password !
        socket?.emit('join', {name: username, roomName:roomName}, () => {
            console.log(username, ' joined room ', id);
        })
        setRoomName(roomName);
        setCurrentRoom(id);
    };

    const handleHover = () => {
        setHover(!hover);
    };

    const leaveRoom = (roomName: string) => {
        socket?.emit('leave', {name: username, roomName:roomName}, () => {
            console.log(username, ' left room ', roomName);
        })
        setRoomName("");
        setCurrentRoom(-1);
    }

  return (
        <div style={Container}>
            { currentRoom < 0 ?
                createRoom ? <CreateRoom socket={socket} setRooms={setRooms} setCreateRoom={setCreateRoom} user={user}/> :
            <div style={middleBlock}>
                <div style={leftBlock}>
                    <div style={navBarChat}>
                        <button style={buttons}
                        >PUBLIC SALON</button>
                        <button style={buttons}
                        onClick={() => setCreateRoom(true)}>CREATE ROOM</button>
                        <div style={returnButton}>
                            <img src={firendLogo} style={friendLogo}></img>
                        </div>
                        <div style={returnButton}>
                            <img src={retLogo} style={returnLogo}></img>
                        </div>
                    </div>
                    <div style={displayBox}>
                        {rooms.map((room) => <RoomEntry room={room} key={room.id} handleSelect={handleSelect}/>)}
                    </div>
                </div>
            </div>
            :
            <Chat name={username} roomId={currentRoom} roomName={roomName} socket={socket} leaveRoom={leaveRoom}/>
            }
        </div>
  )
}

export default RoomSelect
