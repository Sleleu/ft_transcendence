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
import Message from './Message';

interface Room {
    name: string;
    id: number;
    type: string;
    owner?: string;
    inSalon?: string;
}

interface PassObj {
    id: number; 
    roomName: string; 
    type: string;
}

interface Props {
    user: User;
    socket?: Socket;
    changeComponent: (component: string) => void;
}

const RoomSelect:React.FC<Props> = ({user, socket, changeComponent}) => {

    const username = user.username;
    const [rooms, setRooms] = useState<Room[]>([]);
    const [hover, setHover] = useState<boolean>(false);

    const [currentRoom, setCurrentRoom] = useState<number>(-1);
    const [roomName, setRoomName] = useState<string>("");

    const [createRoom, setCreateRoom] = useState<boolean>(false);

    const [showPopup, setShowPopup] = useState(false);
    const[popMsg, setPopMsg] = useState('');

    const [showPublic, setShowPublic] = useState(false);
    const [salonButton, setSalonButton] = useState('PUBLIC SALON');

    const [showPass, setShowPass] = useState(false);
    const [pass, setPass] = useState('');
    const [passInfo, setPassInfo] = useState<PassObj>();

    useEffect(() => {
        socket?.emit('findAllRooms', {}, (response: Room[]) => setRooms(response));
        socket?.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        socket?.on('connect_error', (error) => {
            console.log('Connection error:', error);
        });

        socket?.on('joinError', (response) => {
            console.log(response);
            setPopMsg(response.message);
            setShowPopup(true);
        })
        socket?.on('joinSuccess', (response) => {
            setRoomName(response.roomName);
            setCurrentRoom(response.id);
        })
        socket?.on('newRoom', (room: Room) => {
            setRooms((prevRooms) => [...prevRooms, room]);
        })
        socket?.on('deleted', (roomId: number) => {
            setRooms((prevRooms) => prevRooms.filter(room => room.id !== roomId));
        })
        const handleClickOutside = (event:MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
              setShowPopup(false);
            }
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);

    const privateRooms = rooms.filter(room => room.type === 'private' || room.type === 'direct');
    const publicRooms = rooms.filter(room => room.type !== 'private' && room.type !== 'direct');

    const popupRef = useRef<HTMLDivElement>(null);

    const handleConnect = () => {
        socket?.emit('connectToChat', {name: username}, () => {})
    }

    const Container: CSSProperties = {
        width: '90%', height:'95%', background: 'rgba(0, 0, 0, 0.6)', border: '4px solid', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
    }
    const middleBlock: CSSProperties = { width: '98%', height:'90%', margin: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around',
    }
    const leftBlock: CSSProperties = { width: '70%', height:'95%', margin: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
    }
    const navBarChat: CSSProperties = { height:'10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around',
    }
    const displayBox: CSSProperties = { width: '90%', height: '80%', margin: '10px', padding: '20px', borderRadius: '30px', border: '2px solid #fff', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'auto',
    }
    const buttons: CSSProperties = { width: '20%', height : '80%', borderRadius: '30px', alignSelf: 'center', border: '2px solid #fff', backgroundColor: '#000', color: '#fff', fontWeight: '800', fontSize: '18px', cursor: 'pointer',
    }
    const returnButton: CSSProperties = { width: '10%', height : '80%', borderRadius: '30px', alignSelf: 'center', border: '2px solid #fff', backgroundColor: '#000', color: '#fff', fontWeight: '800', fontSize: '18px', cursor: 'pointer',
    }
    const returnLogo : CSSProperties = { marginLeft: '30%', marginTop: '10px', width: '35%', minWidth:'33px',
    }
    const friendLogo : CSSProperties = { marginLeft: '27%', marginTop: '10px', width: '35%', minWidth:'33px',
    }
    const popupStyle : CSSProperties = { width: '50%', height : '15%', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '2px solid #fff', backgroundColor: '#000', padding: '10px', borderRadius: '5px', color: '#fff', fontWeight: '800', fontSize: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
    }
    const passStyle : CSSProperties = { width: '20%', height : '15%', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '2px solid #fff', backgroundColor: '#000', padding: '10px', borderRadius: '5px', color: '#fff', fontWeight: '800', fontSize: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
    }
    const passInput: CSSProperties = {
        alignSelf: 'center',
        width: '56%',
        height: '1%',
        borderRadius: '15px',
        padding: '20px 30px',
        fontSize: '25px',
        border: 'none',
        boxShadow: 'inset 0 0 7px black',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1, margin: '20px',
    }
    const closePopup : CSSProperties = { cursor: 'pointer', fontSize: '50px', color: '#fff',
    }


    const handleSelect = (id: number, roomName: string, type: string) => {
        if (type === 'protected' && showPass === false)
        {
            setPassInfo({id: id, roomName:roomName, type:type});
            setShowPass(true);
            return ;
        }
        console.log(pass);
        socket?.emit('join', {name: username, roomName:roomName, password: pass}, () => {
            console.log(username, ' joined room ', id);
        })
        setPass('');
        setShowPass(false);
    };

    const handleSubmitPass = (e: React.FormEvent) => {
        e.preventDefault();
        if (passInfo)
            handleSelect(passInfo?.id, passInfo?.roomName, passInfo?.type);
    }

    const handleHover = () => {
        setHover(!hover);
    };

    const leaveRoom = (roomName: string, kick?:boolean) => {
        setRoomName("");
        setCurrentRoom(-1);
        if (kick === true)
        {
            setPopMsg(`You got kicked from room ${roomName}`);
            setShowPopup(true);
        }
    }

    const handleSalonButton = () => {
        if (salonButton === 'PUBLIC SALON')
            setSalonButton('PRIVATE SALON')
        else
            setSalonButton('PUBLIC SALON')
        setShowPublic(!showPublic);
    }

    const handlePassTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value);
    };

  return (
        <div style={Container}>
            { currentRoom < 0 ?
                createRoom ? <CreateRoom socket={socket} setRooms={setRooms} setCreateRoom={setCreateRoom} user={user}/> :
            <div style={middleBlock}>
                <div style={leftBlock}>
                    <div style={navBarChat}>
                        <button style={buttons} onClick={handleSalonButton}
                        >{salonButton}</button>
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
                        {showPublic && publicRooms.map((room) => <RoomEntry room={room} key={room.id} handleSelect={handleSelect} socket={socket}/>)}
                        {showPublic === false && privateRooms.map((room) => <RoomEntry room={room} key={room.id} handleSelect={handleSelect} socket={socket}/>)}
                    </div>
                    {showPopup && (
                    <div className="popup" ref={popupRef} style={popupStyle}>
                    <div className="popup-content">
                        <span className="close" onClick={() => setShowPopup(false)} style={closePopup}>
                        &times;
                        </span>
                        <p>{popMsg}.</p>
                    </div>
                    </div>
                    )}
                    {showPass && <form style={passStyle} onSubmit={handleSubmitPass}>
                        <div onClick={() => setShowPass(false)} style={closePopup}>X</div>
                        <input placeholder='Password' value={pass} onChange={handlePassTyping} style={passInput}></input>
                        <button style={buttons}>Submit</button>
                    </form>}
                </div>
            </div>
            :
            <Chat name={username} roomId={currentRoom} roomName={roomName} socket={socket} leaveRoom={leaveRoom} changeComponent={changeComponent}/>
            }
        </div>
  )
}

export default RoomSelect
