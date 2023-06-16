import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { Socket } from 'socket.io-client';

interface MessageObj {
  id: number;
  name: string;
  text: string;
  roomId: number;
}

interface PopupProps {
  user: User;
  position : {x: number, y: number};
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  socket?: Socket;
  roomName: string;
  clientName: string;
  leaveRoom: (roomName: string, kick?: boolean) => void;
  changeComponent: (component: string) => void;
  confirmScreen: (what: string, message: string, id?: number) => void;
}

interface popupInfo {
  ban: boolean;
  mute: boolean;
  admin: boolean;
  clientAdmin: boolean;
}

interface Room {
  name: string;
  id: number;
  type: string;
  owner?: string;
  inSalon?: string;
}

const PopupChat: React.FC<PopupProps> = ({ user, position, setSelectedUser, socket, roomName, clientName, leaveRoom, changeComponent, confirmScreen }) => {

	const [isVisible, setIsVisible] = useState(true);
	const [ban, setBan] = useState('Ban');
	const [mute, setMute] = useState('Mute');
	const [admin, setAdmin] = useState('Promote as admin');
	const [clientAdmin, setClientAdmin] = useState(false);

	const popupStyle: React.CSSProperties = {
		position: 'fixed',
		top: position.y,
		left: position.x,
		backgroundColor: '#000',
		padding: '10px',
		border: '2px solid #fff',

		display: 'flex',
		flexDirection: 'column',
	  };

	  const UsernameStyle: React.CSSProperties = {
		padding: '10px 20px',
		fontSize: '20px',
		fontWeight: 'bold',
		borderRadius: '5px',
		background: '#000',
		color: '#ffa',
		transition: 'background-color 0.3s ease',
		boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
		alignSelf: 'center',
	};

	  const Buttons: React.CSSProperties = {
		margin: '10px',
		padding: '5px 10px',
		fontSize: '16px',
		fontWeight: 'bold',
		borderRadius: '5px',
		border: 'none',
		background: '#000',
		color: 'white',
		cursor: 'pointer',
		transition: 'background-color 0.3s ease',
		boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
	};
 
  useEffect(() => {

    socket?.emit('popupInfos', { id:user.id, roomName:roomName},
    (response: popupInfo) => {
      if (response.ban === true)
        setBan('Unban');
      if (response.mute === true)
        setMute('Unmute');
      if (response.admin === true)
        setAdmin('Demote admin');
      if (response.clientAdmin === true)
        setClientAdmin(true);
    });


    return () => {
    };

  }, []);
	
  const handleSendMessage = () => {
    leaveRoom(roomName);
    socket?.emit('leave', {roomName: roomName, name: clientName});
    socket?.emit('createDirectMessage', {targetId: user.id});
  };

  const handleInviteToPlay = () => {
    changeComponent('invitePlay' + user.id)
  };

  const handleViewProfile = () => {
    changeComponent('PublicProfile' + user.id)
  };

  const handleAddFriend = () => {
    socket?.emit('send', { id: user.id });
  };

  const handleBlock = () => {
    confirmScreen('block', `Do you really want to block ${user.username} ?`, user.id);
  };

  const handleBan = () => {
    if (ban === 'Ban')
	    socket?.emit('ban', {targetId : user.id, roomName: roomName});
    else if (ban === 'Unban')
      socket?.emit('unban', {targetId : user.id, roomName: roomName});
  };

  const handleKick = () => {
    socket?.emit('kick', {targetId: user.id, roomName: roomName});
  };

  const handleMute = () => {
    if (mute === 'Mute')
      socket?.emit('mute', {targetId: user.id, roomName: roomName});
    else if (mute === 'Unmute')
      socket?.emit('unmute', {targetId: user.id, roomName: roomName});
  };

  const handlePromoteAdmin = () => {
    if (admin === 'Promote as admin')
	    socket?.emit('promoteAdmin', {targetId : user.id, roomName: roomName});
    else if (admin === 'Demote admin')
      socket?.emit('demoteAdmin', {targetId : user.id, roomName: roomName});
  };

  const handleClickOutside = () => {
      setSelectedUser(null);
  };

  return (
    <div className="popup" style={popupStyle} onClick={handleClickOutside} onMouseLeave={handleClickOutside}>
      <span style={UsernameStyle}>{user.username}</span>
      <button style={Buttons} onClick={handleViewProfile}>View Profile</button>
      <button style={Buttons} onClick={handleSendMessage}>Send Message</button>
      <button style={Buttons} onClick={handleInviteToPlay}>Invite to Play</button>
      <button style={Buttons} onClick={handleAddFriend}>Add Friend</button>
      <button style={Buttons} onClick={handleBlock}>Block</button>
      {clientAdmin && <button style={Buttons} onClick={handleBan}>{ban}</button>}
      {clientAdmin && <button style={Buttons} onClick={handleKick}>Kick</button>}
      {clientAdmin && <button style={Buttons} onClick={handleMute}>{mute}</button>}
      {clientAdmin && <button style={Buttons} onClick={handlePromoteAdmin}>{admin}</button>}
    </div>
  );
};

export default PopupChat
