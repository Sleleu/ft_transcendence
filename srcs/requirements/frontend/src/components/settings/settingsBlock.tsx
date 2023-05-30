import { useState, useEffect } from 'react';
import { User } from '../types';
import SettingsBlockOnglet from './settingsBlockOnglet';

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

	// const updateBlock = (friendId)

	return (
		<>
			{blocked.length ?
				(blocked.map((block: blocked) => <SettingsBlockOnglet key={block.id} block={block} />))
				:
				(< p className='text bold'>Blocked User will apear here ! </p>)
			}
		</>
	);
}

export default SettingsBlock;