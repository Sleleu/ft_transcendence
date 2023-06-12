import React, {useState, useEffect, useRef} from 'react'
import { io, Socket } from 'socket.io-client';
import Message from './Message';
import { CSSProperties } from 'styled-components';
import { User } from '../types';
import WhitelistEntry from './WhiteListEntry';
import PopupChat from './PopupChat';
import ConfirmationPopUp from '../popup/ConfirmationPopUp';
import Invite from './Invite';

interface MessageObj {
    id: number;
    name: string;
    text: string;
    roomId: number;
}

interface Props {
    name: string;
    roomId: number;
    roomName: string;
    socket: Socket | undefined;
    leaveRoom: (roomName:string, kick?:boolean) => void;
    changeComponent: (component: string) => void;
    directMsg?: boolean;
}

const Chat:React.FC<Props> = ({name, roomId, roomName, socket, leaveRoom, changeComponent, directMsg}) => {

    const [messages, setMessages] = useState<MessageObj []>([]);
    const [whitelist, setWhitelist] = useState<User[]>([]);
    const [messageText, setMessageText] = useState<string>("");

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

    const [typing, setTyping] = useState<string>("");
    const [hover, setHover] = useState<boolean>(false);

    const [showPopup, setShowPopup] = useState(false);
    const[popMsg, setPopMsg] = useState('');

    const [showAdmin, setShowAdmin] = useState(false);

    const Container: CSSProperties = {
        width: '100%',
        height:'100%',

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
    const topBar: CSSProperties = {
        width: '90%',
        height:'5%',
        margin: '5px',

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
    const rightBlock: CSSProperties = {
        flexGrow: '1',
        height:'90%',
        margin: '15px',

        background: 'rgba(0, 0, 0, 0.6)',
        border: '2px solid #fff',
        borderRadius: '15px',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'auto',
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
        flexDirection: 'column-reverse', justifyContent: 'flex-start',
        overflowY: 'auto', //MARCHE PAS
        wordWrap: 'break-word',
    }
    const typingBox: CSSProperties = {
        marginLeft: '20px',
        width: '60%', height: '8%',
    }
    const typingStyle: CSSProperties = {
        color:'white', fontSize: '18px',
    }
    const inputBox: CSSProperties = {
        width: '95%', height: '8%',
        margin: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
    const inputBar: CSSProperties = {
        borderRadius: '30px', width: '80%',
        border: '2px solid #fff', backgroundColor: '#000',
        fontSize: '20px', color: '#fff',
    }
    const inputButton: CSSProperties = {
        borderRadius: '30px', width: '15%',
        border: '2px solid #fff', backgroundColor: '#000',
        fontSize: '20px', fontWeight: '500', color: '#fff',
        cursor: hover ? 'pointer' : 'auto',
    }
    const leaveButton: CSSProperties = {
        borderRadius: '30px', width: '15%',
        border: '2px solid #fff', backgroundColor: '#000',
        fontSize: '20px', fontWeight: '500', color: '#fff', textAlign: 'center',
        cursor: hover ? 'pointer' : 'auto',
    }
    const RoomName: CSSProperties = {
        fontSize: '48px', fontWeight:'800', color: '#fff', width:'30%',
    }
    const popupStyle : CSSProperties = {
        width: '50%', height : '15%',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid #fff', backgroundColor: '#000',
        padding: '10px',
        borderRadius: '5px',

        color: '#fff', fontWeight: '800', fontSize: '36px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
    const closePopup : CSSProperties = {
        cursor: 'pointer',
        fontSize: '50px',
        color: '#fff',
    }
    const title: CSSProperties = {color: '#fff', alignSelf: 'center', display:'flex', flexDirection:'column', fontSize: '24px', fontWeight:'800', padding: '10px',}


    useEffect(() => {
        socket?.emit('findRoomMessages', {id: roomId}, (response: MessageObj[]) => {
        setMessages(response);
        });
        socket?.emit('getWhitelist', {roomName: roomName}, () => {
            });
        socket?.emit('isAdmin', {roomName:roomName},
        (response: boolean) => {
            if (response === true)
                setShowAdmin(true);
        });

            socket?.on('newUserInChat', (user: User) => {
                setWhitelist((prev) => [...prev, user]);
            });

        socket?.on('message', (message: MessageObj) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket?.on('whitelist', (users: User[]) => {
            setWhitelist(users);
        })

        socket?.on('kickUser', (response) => {
            leaveRoom(response.name, true);
        })

        socket?.on('msgError', (response) => {
            setPopMsg(response.message);
            setShowPopup(true);
            setMessageText('');
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

        return () => {
            socket?.emit('leave', {name: name, roomName:roomName}, () => {
            console.log(name, ' left room ', roomName);
            })
            socket?.off('message');
        };
        
    }, []);
    
    const popupRef = useRef<HTMLDivElement>(null);

socket?.on('typing', ({name, isTyping}) => {
   if (isTyping) {
    setTyping(name + " is typing...");
   } else {
    setTyping("");
   }
})

const emitTyping = () => {
    if (!typing)
        socket?.emit('typing', { isTyping: true });
    setTimeout(() => {socket?.emit('typing', {isTyping: false})}, 2000);
}

const sendMessage = async () => {
    console.log(messageText);
    socket?.emit('createMessage', { name: name, text: messageText, room: roomId, roomName: roomName},
    (response: MessageObj) => {
        setMessageText("");
    })
    socket?.on('error', (error: any) => {
        console.error('Socket.IO connection error:', error);
      });
}

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText)
        sendMessage();
}

const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
    emitTyping();
};

const handleHover = () => {
    setHover(!hover);
};

const handleUserClick = (user: User, event: React.MouseEvent<HTMLSpanElement>) => {
    if (user.username !== name)
    {
        setSelectedUser(user);
        setPopupPosition({ x: event.clientX, y: event.clientY });
    }
};

const handleDelete = () => {
    confirmScreen('delete', 'Do you really want to delete the room ?');
}

const confirmScreen = (what: string, message: string, id?: number) => {
    setVisible(true);
    setWhatConfirm(what);
    setConfirmMessage(message);
    if (id)
        setIdConfirm(id);
}

const [visible, setVisible] = useState(false);
const [confirmMessage, setConfirmMessage] = useState('');
const [whatConfirm, setWhatConfirm] = useState('');
const [idConfirm, setIdConfirm] = useState<number>();
const onConfirm = (confirm: boolean) => {
    if (confirm && whatConfirm === 'delete')
    {
        leaveRoom(roomName);
        socket?.emit('deleteRoom', {roomName:roomName}, () => {
        });
    }
    if (confirm && whatConfirm === 'block')
        socket?.emit('bloqueFriend', { id: idConfirm });
    if (confirm && whatConfirm === 'add')
    {
        socket?.emit('addToChat', {friendId: idConfirm, roomName:roomName});
    }
    setConfirmMessage('');
    setWhatConfirm('');
}
const onVisible = (state: boolean) => {
    setVisible(state)
}

    const [invite, setInvite] = useState(false);
    const sortedMessages =  messages.sort((a, b) => b.id - a.id);

    return (
        <div style={Container}>
            {visible === true && <ConfirmationPopUp onConfirm={onConfirm} onVisible={onVisible} opacity={true} message={confirmMessage} />}
            <div style={topBar}>
                <span style={RoomName}>{roomName}</span>
                <div style={leaveButton} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={() => leaveRoom(roomName)}>LEAVE</div>
                {showAdmin && <div style={leaveButton} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={() => handleDelete()}>DELETE</div>}
                <div style={leaveButton} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={() => setInvite(!invite)}>{invite ? 'SALON' : 'INVITE'}</div>
            </div>
            <div style={middleBlock}>
                <div style={leftBlock}>
                    <div style={displayBox}>
                        {sortedMessages.map((message) => <Message message={message} key={message.id}/>)}
                    </div>
                    <div style={typingBox}>
                        {(typing) ? <div style={typingStyle}>{typing}</div> : null}
                    </div>
                    <form  style={inputBox} onSubmit={handleSubmit}>
                        <input style={inputBar}  value={messageText} onChange={handleTyping}></input>
                        <button style={inputButton} onMouseEnter={handleHover} onMouseLeave={handleHover}>SEND</button>
                    </form>
                </div>
                <div style={rightBlock}>
                    {invite && <Invite socket={socket} roomName={roomName} whitelist={whitelist} confirmScreen={confirmScreen}/>}
                    {!invite && <div style={title}>IN SALON</div>}
                    {!invite && whitelist.map((user) => <WhitelistEntry user={user} handleUserClick={handleUserClick} key={user.id} roomId={roomId} socket={socket} clientName={name}/>)}
                </div>
                <div>
                 {selectedUser && <PopupChat user={selectedUser} position={popupPosition} setSelectedUser={setSelectedUser} socket={socket} roomName={roomName} clientName={name} leaveRoom={leaveRoom} changeComponent={changeComponent} confirmScreen={confirmScreen}/>}
                </div>
                {showPopup && (
                    <div className="popup" ref={popupRef} style={popupStyle}>
                    <div className="popup-content">
                        <span className="close" onClick={() => setShowPopup(false)} style={closePopup}>
                        &times;
                        </span>
                        <p>{popMsg}</p>
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
