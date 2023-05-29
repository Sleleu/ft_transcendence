import { useState, useEffect } from 'react';
import { User } from '../types';

interface blocked {
	senderId: number
	sender: User
	recipientId: number
	recipient: User
	id: number
}

const SettingsBlock = () => {

	const [blocked, setBlocked] = useState([])

	useEffect(() => {
		const setBlock = async () => {
			const req = 'http://localhost:5000/users/blockUser'
			const data = await fetch(req, { method: "GET", credentials: "include" })
			const list = await data.json()
			setBlocked(list)
		}
		setBlock()
	}, [])

	return (
		<>
			{blocked.length ?
				(blocked.map((block: blocked) => <p key={block.id} className='text bold'>{block.recipient.username}</p>))
				:
				(< p className='text bold'>Blocked User will apear here ! </p>)
			}
		</>
	);
}

export default SettingsBlock;