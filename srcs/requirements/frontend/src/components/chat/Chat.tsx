import React, {useState, useEffect, useRef} from 'react'
import './Chat.css'
import { io } from 'socket.io-client';
import Message from './Message';

interface MessageObj {
    name: string;
    text: string;
}

function Chat() {
const socket = io('http://localhost:5000');
const [messages, setMessages] = useState<MessageObj []>([]);

useEffect(() => {
    socket.emit('findAllMessages', {}, (response: MessageObj[]) => {
        setMessages(response);
    })
    console.log(messages);
})

    return (
        <div className="chat">
            {messages.map((message) => <Message message={message} />)}
        </div>
    );
}

export default Chat;
