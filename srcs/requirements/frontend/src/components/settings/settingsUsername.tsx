import { useState, ChangeEvent } from 'react';

import { Cont } from '../container/container'
import { User } from '../types'
import Cookies from 'js-cookie';

interface SettingsUsernameProps {
	user: User;
}

const SettingsUsername = ({ user}: SettingsUsernameProps) => {

	const [newUsername, setNewUsername] = useState('');

	const handleNewUsername = (event: ChangeEvent<HTMLInputElement>) => {
		setNewUsername(event.target.value);
	}

	const handleSubmit = async () => {
		const access_token = Cookies.get('Authorization')
		const response = await fetch('http://localhost:5000/users/update-username', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({ newUsername }),
		credentials: "include",  
		});
			const data = await response.json();
			console.log(data);
	  };

	return (
		<Cont alignItems='center' padding='10px' margin='5px' width='380px' height='70%'>
			<p className='text bold medium cyan-stroke'>Your current username :</p>
			<p className='text medium purple-stroke neon-purple'>{user.username}</p>
			<p className='text bold'>If you want to change, please enter a new username :</p>
			<input
				className="text bold password-input"
				type="text"
				value={newUsername}
				placeholder="new username"
				onChange={handleNewUsername}
			/>
			<br />
			<button 
				className="btn-little medium text bold cyan-stroke"
				onClick={handleSubmit} >Change Username</button>
		</Cont>
	);
}

export default SettingsUsername;