import React, {useState, useEffect, useRef} from 'react'
import { CSSProperties } from 'react'
import Chat from './Chat';
import { io, Socket } from 'socket.io-client';

interface Room {
    name: string;
    id: number;
}

interface Props {
    username: string;
}

const RoomSelect:React.FC<Props> = ({username}) => {

    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomText, setRoomText] = useState<string>("");
    const [socket, setSocket] = useState<Socket>();
    const [hover, setHover] = useState<boolean>(false);

    const [currentRoom, setCurrentRoom] = useState<number>(-1);
    const [roomName, setRoomName] = useState<string>("");

    useEffect(() => {
        const sock = io('http://localhost:5000');
        setSocket(sock);

        sock.emit('findAllRooms', {}, (response: Room[]) => setRooms(response));

        return () => {
        sock.disconnect();
        };
    }, []);

    const handleConnect = () => {
        socket?.emit('connectToChat', {name: username}, () => {})
    }

    socket?.on('connect', () => {
        handleConnect();
        console.log('Connected to Socket.IO server');
    });
    
    socket?.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
    });
    
    socket?.on('connect_error', (error) => {
        console.log('Connection error:', error);
    });

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
    const displayBox: CSSProperties = {
        width: '90%', height: '80%',
        margin: '10px',
        padding: '20px',
        borderRadius: '30px',
        border: '2px solid #fff', backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column', justifyContent: 'center',
        wordWrap: 'break-word',
    }    
    const RoomsStyle: CSSProperties = {
        alignSelf: 'center', margin : '5px', padding: '10px',
        color: '#fff',
        border: '1px solid white',
        borderRadius: '30px',
        cursor: hover ? 'pointer':'auto',
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomText)
            return ;
        socket?.emit('createRoom', { name:roomText },
        (response: Room) => {
            setRooms((prevRooms) => [...prevRooms, response]);
            setRoomText("");
        })
    }

    const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomText(event.target.value);
    };
   
    const handleSelect = (id: number, roomName: string) => {
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
            <div style={middleBlock}>
                <div style={leftBlock}>
                    <form onSubmit={handleSubmit}>
                        <input value={roomText} onChange={handleTyping}></input>
                        <button>CREATE ROOM</button>
                    </form>
                    <div style={displayBox}>
                        {rooms.map((room) => <div
                            style={RoomsStyle}
                            key={room.id}
                            onClick={() => handleSelect(room.id, room.name)}
                            onMouseEnter={handleHover}
                            onMouseLeave={handleHover}
                            >{room.name}</div>)}
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
