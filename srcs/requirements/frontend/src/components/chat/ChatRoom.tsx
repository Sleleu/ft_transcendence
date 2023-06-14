import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';
import { User } from '../types';
import './ChatRoom.css'
import {ChatRoomData, Room} from './chatTypes';
import EntryUsersChat from './EntryUsersChat'
import PopupChat from './PopupChat';

interface Props {
    socket: Socket | undefined;
	roomIdStr: string;
	user: User;
	changeComponent: (component: string) => void
}

// const sortFriend = (friend: FriendInterface[]) => {
//     return friend.sort((a, b) => (a.friend.state !== 'offline' ? -1 : 1))
//   }
// const filteredFriends = searchFriend.map((friend) => friend.friend).filter((user) => !whitelist.some((whitelistedUser) => whitelistedUser.id === user.id));

const ChatRoom:React.FC<Props> = ({socket, roomIdStr, user, changeComponent}) => {

	const roomId = Number(roomIdStr);

	const [whitelist, setWhiteList] = useState<User[]>([]);
	const [admins, setAdmins] = useState<User[]>([]);
	const [banned, setBanned] = useState<User[]>([]);
	const [connected, setConnected] = useState<User[]>([]);
	const [friends, setFriends] = useState<User[]>([]);
	const [room, setRoom] = useState<Room>();
	const filteredWhitelist = whitelist.filter((user) =>
	 !banned.some((bannedUser) => bannedUser.id === user.id));

	 useEffect(() => {
        socket?.emit('getChatRoomData', {roomId:roomId}, (data: ChatRoomData) => {
			setWhiteList(data.whitelist);
			setAdmins(data.admins);
			setBanned(data.banned);
			setConnected(data.connected);
			setFriends(data.friends);
			setRoom(data.room);
		});
		socket?.on('refreshWhiteList', (newUser: User) => {
            setWhiteList((prevList) => [...prevList, newUser]);
        })
		socket?.on('refreshAdmins', (newUser: User) => {
            setAdmins((prevList) => [...prevList, newUser]);
        })
		socket?.on('refreshBanned', (newUser: User, unban: boolean) => {
			if (unban)
				setBanned((prev) => prev.filter((user) => user.id !== newUser.id))
            else
				setBanned((prevList) => [...prevList, newUser]);
        })
		socket?.on('refreshConnected', (newUser: User, undo: boolean) => {
            if (undo)
				setConnected((prev) => prev.filter((user) => user.id !== newUser.id))
			else
				setConnected((prevList) => [...prevList, newUser]);
        })
		socket?.on('kickUser', (response) => {
            changeComponent('chat');
        })
		socket?.on('msgError', (response) => {
            setPopMsg(response.message);
            setShowPopup(true);
        })

		// NON FONCTIONNEL : MODIFIER LEAVE / JOIN (doit prendre id)
        return () => {
            socket?.emit('leave', {name: user.username, roomName:room?.name}, () => {
            console.log(user.username, ' left room ', room?.name);
            })
            socket?.off('message');
        };
    }, []);

	const [usersField, setUsersField] = useState('salon');
	const colorField : string = (usersField === 'salon') ? '#0ff'
	: (usersField === 'friends') ? '#f0f' : '#e00';
	const subColorField : string = (usersField === 'salon') ? '#055'
	: (usersField === 'friends') ? '#606' : '#700';

	const UsersList: CSSProperties = {	border: `3px solid ${colorField}`,
		boxShadow: `inset 0 0 50px ${subColorField}, 0 0 10px ${colorField}`,
	}
	const selectUsersField = (field : string) => {
		setUsersField(field);
	}
	const salonButton: CSSProperties = {height: usersField === 'salon' ? '40px': '30px',}
	const blockedButton: CSSProperties = {height: usersField === 'banned' ? '40px': '30px',}
	const friendsButton: CSSProperties = {height: usersField === 'friends' ? '40px': '30px',}

	const [selectedTarget, setSelectedTarget] = useState<User | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

	const handleUserClick = (target: User, event: React.MouseEvent<HTMLSpanElement>) => {
		if (target.username !== user.username)
		{
			setSelectedTarget(target);
			setPopupPosition({ x: event.clientX, y: event.clientY });
		}
	};

    const [showPopup, setShowPopup] = useState(false);
    const[popMsg, setPopMsg] = useState('');
    const popupRef = useRef<HTMLDivElement>(null);
	const handleClickOutside = (event:MouseEvent) => {
		if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
		  setShowPopup(false);
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
		document.removeEventListener('mousedown', handleClickOutside);
		};
	}

    return (
        <div className='ChatRoom'>
			<div>
			{showPopup && (
                    <div className="popupMsg" ref={popupRef}>
                    <div className="popupMsg-content">
                        <span className="closeMsg" onClick={() => setShowPopup(false)}>
                        &times;
                        </span>
                        <p className="popupMsgText">{popMsg}</p>
                    </div>
                    </div>
                    )}
			</div>
        <div className='UsersBlock'>
			<div className='UsersTopBar'>
			<button style={salonButton} className='salonButton' onClick={() => selectUsersField('salon')}>SALON</button>
			<button style={blockedButton} className='blockedButton' onClick={() => selectUsersField('banned')}>BANNED</button>
			<button style={friendsButton} className='friendsButton' onClick={() => selectUsersField('friends')}>FRIENDS</button>
			</div>
			<div className='UsersList' style={UsersList}>
			{usersField === 'salon' && filteredWhitelist.map((target) => <EntryUsersChat socket={socket} user={user}
			 target={target} field='salon' changeComponent={changeComponent} handleUserClick={handleUserClick} connected={connected}/>)}
			{usersField === 'banned' && banned.map((target) => <EntryUsersChat socket={socket} user={user}
			 target={target} field='banned' changeComponent={changeComponent} handleUserClick={handleUserClick} connected={connected}/>)}
			{usersField === 'friends' && friends.map((target) => <EntryUsersChat socket={socket} user={user}
			 target={target} field='friends' changeComponent={changeComponent} handleUserClick={handleUserClick} connected={connected}/>)}
			</div>
	    </div>
	<div>
	{selectedTarget && <PopupChat user={selectedTarget} position={popupPosition} setSelectedTarget={setSelectedTarget} socket={socket}
	 room={room} clientName={user.username} changeComponent={changeComponent}/>}
   </div>

    </div>
  )
}

export default ChatRoom
