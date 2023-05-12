import React, {useState, useEffect, useRef} from 'react'
import './Chat.css'
import { io, Socket } from 'socket.io-client';
import Message from './Message';
import { CSSProperties } from 'styled-components';

interface MessageObj {
    id: number;
    name: string;
    text: string;
}

interface Props {
    name: string;
}

const Chat:React.FC<Props> = ({name}) => {

    const [messages, setMessages] = useState<MessageObj []>([]);
    const [messageText, setMessageText] = useState<string>("");

    const [joined, setJoined] = useState<boolean>(true);
    const [typing, setTyping] = useState<string>("");
    const [socket, setSocket] = useState<Socket>();

    const [hover, setHover] = useState<boolean>(false);
    
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
        flexDirection: 'column', justifyContent: 'flex-end',
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
    
    
    useEffect(() => {
        const sock = io('http://localhost:5000');
        setSocket(sock);
        sock.emit('findAllMessages', {}, (response: MessageObj[]) => {
        setMessages(response);
        });

        sock.on('message', (message: MessageObj) => {
            console.log("messageSet : ", message.id);
        setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
        sock.disconnect();
        };
  }, []);

  socket?.on('connect', () => {
    join();
    console.log('Connected to Socket.IO server');
  });

  socket?.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
  });

  socket?.on('connect_error', (error) => {
    console.log('Connection error:', error);
  });

socket?.on('typing', ({name, isTyping}) => {
   if (isTyping) {
    setTyping(name + " is typing...");
   } else {
    setTyping("");
   }
})

const join = () => {
    socket?.emit('join', {name: name}, () => {
        setJoined(true);
    })
}

const emitTyping = () => {
    if (!typing)
        socket?.emit('typing', { isTyping: true });
    setTimeout(() => {socket?.emit('typing', {isTyping: false})}, 2000);
}

const sendMessage = async () => {
    socket?.emit('createMessage', { name: name, text: messageText},
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

    return (
        <div style={Container}>
            <div style={topBar}>
                {/* NAVBAR DU CHAT */}
            </div>    
            <div style={middleBlock}>
                <div style={leftBlock}>
                    <div style={displayBox}>
                        {messages.map((message) => <Message message={message} key={message.id}/>)}
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
                    {/* AMIS */}
                </div>
            </div>
        </div>  
    );
}

export default Chat;
