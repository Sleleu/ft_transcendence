import {useState, ChangeEvent} from 'react';

import {Cont} from '../container/container'
import {User} from '../types'

const SettingsUsername = ({ user }: { user: User }) => {

	const [newUsername, setNewUsername] = useState('');

	const handleNewUsername = (event : ChangeEvent<HTMLInputElement>) => {
		setNewUsername(event.target.value);
	}

	return (
		<Cont alignItems='center' padding='10px' margin='5px' width='380px' height='70%'>
			<p className='text bold medium cyan-stroke'>Your current username :</p>
			<p className='text medium purple-stroke neon-purple'>{user.name}</p>
			<p className='text bold'>If you want to change, please enter a new username :</p>
			<input className="text bold password-input" type="text" value={newUsername} placeholder="new username" onChange={handleNewUsername} />
			<br/>
			<button className="btn-little medium text bold cyan-stroke">Change Username</button>
		</Cont>
	);
}

const SettingsAvatar = () => {
	return (
		<>
			<p className='text bold'>Current username :</p>
			<button className='btn-little text bold medium cyan-stroke'>Change Avatar</button>
		</>
	);
}

const SettingsBlock = () => {
	return (
		<>
			<p className='text bold'>This is a list of blocked users :</p>
		</>
	);
}

const SettingsLock = () => {
	return (
		<>
			<p className='text bold'>2F authentication</p>
		</>
	);
}

export {SettingsUsername,
		SettingsAvatar,
		SettingsBlock,
		SettingsLock};