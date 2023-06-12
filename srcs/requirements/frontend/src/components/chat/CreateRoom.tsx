import React, { CSSProperties, useEffect, useRef, useState } from 'react'
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
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignSelf: 'center',
        width: '50%', height:'70%',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
    }
    const FormStyle: CSSProperties = {
        display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignContent: 'center',
        margin: '30px',
    }
    const RoomTypeStyle: CSSProperties = {
        color: 'white',
        padding: '20px',
        fontSize: '36px',
    }
    const ReturnButtonStyle : CSSProperties = {
        alignSelf: 'center', backgroundColor: '#000', width: '25%', height: '8%', textAlign: 'center',
        fontSize: '20px', fontWeight: '600px', fontFamily: 'Montserrat, sans-serif', color: '#fff', border: '3px solid #a0a', borderRadius: '20px', cursor:'pointer',
        boxShadow: 'inset 0 0 50px #a0a',
    }
    const CreateButtonStyle : CSSProperties = {
        alignSelf: 'center', backgroundColor: '#000', width: '20%', height: '40%', textAlign: 'center',
        fontSize: '20px', fontWeight: '600px', fontFamily: 'Montserrat, sans-serif', color: '#fff', border: '3px solid #0aa', borderRadius: '20px', cursor:'pointer',
        boxShadow: 'inset 0 0 50px #0aa',
    }
    const InputBox: CSSProperties = {
        alignSelf: 'center',
        width: '56%',
        height: '1%',
        borderRadius: '15px',
        padding: '20px 30px',
        fontSize: '25px',
        border: 'none',
        boxShadow: 'inset 0 0 7px black',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        margin: '20px',
    } 
    const TickBox: CSSProperties = {
        display: 'flex', justifyContent: 'center', 
    }
    const smallBox: CSSProperties = {
        width: '35px',
        height: '35px',
        borderRadius: '20px',
    }
    const popupStyle : CSSProperties = { width: '50%', height : '15%', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '2px solid #fff', backgroundColor: '#000', padding: '10px', borderRadius: '5px', color: '#fff', fontWeight: '800', fontSize: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
    }
    const closePopup : CSSProperties = { cursor: 'pointer', fontSize: '50px', color: '#fff',
    }

    const [roomText, setRoomText] = useState<string>("");
    const [checkbox, setCheckbox] = useState<string>("public");
    const [password, setPassword] = useState<string>("");

    const [showPopup, setShowPopup] = useState(false);
    const[popMsg, setPopMsg] = useState('');

    useEffect(() => {

        socket?.on('createError', (response) => {
            setPopMsg(response.message);
            setShowPopup(true);
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
    const popupRef = useRef<HTMLDivElement>(null);

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
        <form style={FormStyle} onSubmit={handleSubmit}>
            <div style={TickBox}>
            <div style={RoomTypeStyle}><input type='checkbox' checked={checkbox === 'public'} onChange={() => handleCheckboxChange('public')} style={smallBox}></input>PUBLIC</div>
            <div style={RoomTypeStyle}><input type='checkbox' checked={checkbox === 'private'} onChange={() => handleCheckboxChange('private')} style={smallBox}></input>PRIVATE</div>
            <div style={RoomTypeStyle}><input type='checkbox' checked={checkbox === 'protected'} onChange={() => handleCheckboxChange('protected')} style={smallBox}></input>PROTECTED</div>
            </div>
            {checkbox === 'protected' ?
            <input value={password} type='password' onChange={handlePassTyping} placeholder='Password' style={InputBox}></input>
            : null}
            <input value={roomText} onChange={handleTyping} placeholder='Room Name' style={InputBox}></input>
            <button style={CreateButtonStyle}>CREATE</button>
        </form>
            <button onClick={() => setCreateRoom(false)} style={ReturnButtonStyle}>Return</button>
    </div>
  )
}

export default CreateRoom
