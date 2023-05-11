import React, {useState, useEffect, useRef} from 'react'
import './Chat.css'
import { io, Socket } from 'socket.io-client';
import Message from './Message';

interface MessageObj {
    id: number;
    name: string;
    text: string;
}

interface Props {
}

const Chat:React.FC<Props> = () => {

    const [messages, setMessages] = useState<MessageObj []>([]);
    const [messageText, setMessageText] = useState<string>("");

    const [joined, setJoined] = useState<boolean>(true);
    const [name, setName] = useState<string>("gmansuy");
    const [typing, setTyping] = useState<string>("");
    const [socket, setSocket] = useState<Socket>();

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

//   socket.on('connect', () => {
//     console.log('Connected to Socket.IO server');
//   });

//   socket.on('disconnect', () => {
//     console.log('Disconnected from Socket.IO server');
//   });

//   socket.on('connect_error', (error) => {
//     console.log('Connection error:', error);
//   });

// socket.on('typing', ({name, isTyping}) => {
//    if (isTyping) {
//     setTyping(name + "is typing...");
//    } else {
//     setTyping("");
//    }
// })

// const join = () => {
//     socket.emit('join', {name: name}, () => {
//         setJoined(true);
//     })
// }

// let timeout : any;
// const emitTyping = () => {
//     socket.emit('typing', { isTyping: true });
//     timeout = setTimeout(() => {socket.emit('typing', {isTyping: false})}, 2000);
// }

const sendMessage = async () => {
    console.log("Message Submited : ", {messageText});
    socket?.emit('createMessage', { name: name, text: messageText},
    (response: MessageObj) => {
        setMessageText("");
        console.log("Message Sent : ", {response});
    })
    socket?.on('error', (error: any) => {
        console.error('Socket.IO connection error:', error);
      });
}

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
}

const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
};

    return (
        <div className="chat">
            {messages.map((message) => <Message message={message} key={message.id}/>)}
            {/* {(typing != "") ? <div>{typing}<div /> : null} */}
            <form onSubmit={handleSubmit}>
                <input value={messageText} onChange={handleTyping}></input>
                <button>Send</button>
            </form>
        </div>
    );
}

export default Chat;
