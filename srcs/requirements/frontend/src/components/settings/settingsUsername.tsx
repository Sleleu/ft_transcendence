import { useState, ChangeEvent, useEffect } from 'react';

import { Cont } from '../container/container'
import { User } from '../types'

interface SettingsUsernameProps {
	user: User;
}

const SettingsUsername = ({ user}: SettingsUsernameProps) => {

	const [newUsername, setNewUsername] = useState('');

	const handleNewUsername = (event: ChangeEvent<HTMLInputElement>) => {
		setNewUsername(event.target.value);
	}

	const handleSubmit = async () => {
		const response = await fetch('http://localhost:5000/users/update-username', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json', 'Authorization': 'TOKEN ICI'},
			body: JSON.stringify({ newUsername }),
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