import React from 'react'
import { CSSProperties } from 'styled-components';

interface MessageObj {
    name: string;
    text: string;
}

interface Props {
    message: MessageObj;
    key: number;
  }

const Message:React.FC<Props> = ({message}) => {

  const text: CSSProperties = {
    color:'white', fontSize: '20px',
}

  return (
    <div>
      <span style={text}> [{message.name}] : {message.text} </span>
    </div>
  )
}

export default Message
