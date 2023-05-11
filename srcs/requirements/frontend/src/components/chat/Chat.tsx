import React, {useState, useEffect, useRef} from 'react'
import './Chat.css'
import { io } from 'socket.io-client';
import Message from './Message';

interface MessageObj {
    name: string;
    text: string;
}

interface Props {
}

const Chat:React.FC<Props> = () => {

const socket = io('http://localhost:5000');
const [messages, setMessages] = useState<MessageObj []>([]);
const [messageText, setMessageText] = useState<string>("");
const [joined, setJoined] = useState<boolean>(true);
const [name, setName] = useState<string>("gmansuy");
const [typing, setTyping] = useState<string>("");

useEffect(() => {
    socket.emit('findAllMessages', {}, (response: MessageObj[]) => {
        setMessages(response);
    })
    console.log(messages);

    socket.on('message', (message) => {
        setMessages([...messages, message]);
    })

    socket.on('typing', ({name, isTyping}) => {
       if (isTyping) {
        setTyping(name + "is typing...");
       } else {
        setTyping("");
       }
    })
})

const join = () => {
    socket.emit('join', {name: name}, () => {
        setJoined(true);
    })
}

let timeout : any;
const emitTyping = () => {
    socket.emit('typing', { isTyping: true });
    timeout = setTimeout(() => {socket.emit('typing', {isTyping: false})}, 2000);
}

const sendMessage = () => {
    socket.emit('createMessage', { text: messageText},
    (response: MessageObj) => {
        setMessageText("");
    })
}

const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
};

    return (
        <div className="chat">
            {messages.map((message) => <Message message={message} />)}
            {/* {(typing != "") ? <div>{typing}<div /> : null} */}
            <form onSubmit={sendMessage}>
                <input value={messageText} onChange={handleTyping}></input>
            </form>
        </div>
    );
}

export default Chat;
