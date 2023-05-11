import React from 'react'

interface MessageObj {
    name: string;
    text: string;
}

interface Props {
    message: MessageObj;
    key: number;
  }

const Message:React.FC<Props> = ({message}) => {
  return (
    <div>
      <span> [{message.name}] : {message.text} </span>
    </div>
  )
}

export default Message
