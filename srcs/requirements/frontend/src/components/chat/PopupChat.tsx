import React, { useState } from 'react';
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
}

const PopupChat: React.FC<PopupProps> = ({ user, position, setSelectedUser, socket, roomName }) => {

	const [isVisible, setIsVisible] = useState(true);

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

	const handleSendMessage = () => {
    // Implement your logic for sending a message to the user
  };

  const handleInviteToPlay = () => {
    // Implement your logic for inviting the user to play
  };

  const handleAddFriend = () => {
    // Implement your logic for adding the user as a friend
  };

  const handleBlock = () => {
    // Implement your logic for blocking the user
  };

  const handleBan = () => {
	socket?.emit('ban', {target : user.username, roomName: roomName});
};

  const handleKick = () => {
    socket?.emit('kick', {targetId: user.id, roomName: roomName});
  };

  const handleMute = () => {
    // Implement your logic for muting the user
  };

  const handlePromoteAdmin = () => {
	socket?.emit('promoteAdmin', {target : user.username, roomName: roomName});
};

  const handleClickOutside = () => {
    setSelectedUser(null);
  };

  return (
    <div className="popup" style={popupStyle} onClick={handleClickOutside} onMouseLeave={handleClickOutside}>
      <span style={UsernameStyle}>{user.username}</span>
      <button style={Buttons} onClick={handleSendMessage}>Send Message</button>
      <button style={Buttons} onClick={handleInviteToPlay}>Invite to Play</button>
      <button style={Buttons} onClick={handleAddFriend}>Add Friend</button>
      <button style={Buttons} onClick={handleBlock}>Block</button>
      <button style={Buttons} onClick={handleBan}>Ban</button>
      <button style={Buttons} onClick={handleKick}>Kick</button>
      <button style={Buttons} onClick={handleMute}>Mute</button>
      <button style={Buttons} onClick={handlePromoteAdmin}>Promote as Admin</button>
    </div>
  );
};

export default PopupChat
