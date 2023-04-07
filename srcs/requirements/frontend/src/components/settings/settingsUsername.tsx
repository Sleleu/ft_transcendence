import {useState, ChangeEvent} from 'react';

import {Cont} from '../container/container'
import {User} from '../types'

interface SettingsUsernameProps {
	user: User;
}

const SettingsUsername = ({ user }: SettingsUsernameProps) => {

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

export default SettingsUsername;