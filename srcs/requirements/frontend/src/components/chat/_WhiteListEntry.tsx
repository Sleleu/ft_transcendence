import { CSSProperties } from "styled-components";
import { User } from "../types";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
	user: User;
  handleUserClick: (user: User, event: React.MouseEvent<HTMLSpanElement>) => void;
	key: number;
  roomId: number;
  socket: Socket | undefined;
  clientName: string;
}

const WhitelistEntry:React.FC<Props> = ({user, handleUserClick, roomId, socket, clientName}) => {

  const [connected, setConnected] = useState(true);

  const entry : CSSProperties = {alignSelf:'center', cursor: clientName === user.username ?'cursor' : 'pointer',}
  const text: CSSProperties = {
    color: connected ? '#fff' : '#666', fontSize: '30px', margin:'10px', alignSelf:'center',
  }

  useEffect(() => {
    socket?.emit('isConnected', {roomId: roomId, userId: user.id}, (isConnected: boolean) => {
      if (!isConnected)
        setConnected(false);
    })
    socket?.on('justConnected', (username: string) => {
      if (username === user.username)
      {
        setConnected(true);
      }
    } )
    socket?.on('justDisconnected', (username: string) => {
      if (username === user.username)
      {
        setConnected(false);
      }
    } )
    
  }, []);


  return (
    <div style={entry}>
      <span style={text} onClick={(event) => handleUserClick(user, event)}> {user.username} </span>
    </div>
  )
}

export default WhitelistEntry
