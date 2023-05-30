import { useState, ChangeEvent } from 'react';

import { Cont } from '../container/container'
import { User } from '../types'
import '../../css/Text.css'

interface SettingsUsernameProps {
	user: User;
}

const SettingsUsername = ({ user}: SettingsUsernameProps) => {

	const [gameLogin, setgameLogin] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handlegameLogin = (event: ChangeEvent<HTMLInputElement>) => {
		setgameLogin(event.target.value);
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError(null);
		try {
			const response = await fetch('http://localhost:5000/users/update-gameLogin', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({ gameLogin }),
				credentials: "include",  
			});
			if (!response.ok) {
				const errorData = await response.json();
				setError(errorData.message || 'Something went wrong');
				return;
			}
			const data = await response.json();
			console.log(data);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
				setError(error.message);
			}
		}
	}

	return (
		<Cont alignItems='center' padding='10px' margin='5px' width='380px' height='70%'>
			<p className='text bold medium cyan-stroke'>Your current username :</p>
			<p className='text medium purple-stroke neon-purple'>{user.gameLogin}</p>
			<p className='text bold'>If you want to change, please enter a new username :</p>
			<input
				className="text bold password-input"
				type="text"
				value={gameLogin}
				placeholder="new username"
				onChange={handlegameLogin}
			/>
            {error && <p className="red neon-red">{error}</p>}
			<br />
			<button 
				className="btn-little medium text bold cyan-stroke"
				onClick={handleSubmit} >Change Username</button>
		</Cont>
	);
}

export default SettingsUsername;