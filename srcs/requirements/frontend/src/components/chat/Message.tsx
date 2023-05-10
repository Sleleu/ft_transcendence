import React from 'react'

interface MessageObj {
    name: string;
    text: string;
}

interface Props {
    message: MessageObj;
  }  

const Message:React.FC<Props> = ({message}) => {
  return (
    <div>
      <span> [{message.name}] : {message.text} </span>
    </div>
  )
}

export default Message
