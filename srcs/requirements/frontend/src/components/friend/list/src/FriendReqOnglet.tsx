import React from 'react'
import { User } from '../../../types';
import '../css/FriendReqOnglet.css'
import { useState, useEffect } from 'react';

const FriendReqOnglet = ({ sender }: { sender: User }) => {

	const padd = {
		paddingLeft: '7%',
	}

	return (
		<div className='containerFriendReqOnglet'>
			<div style={padd} className='nameText'>{sender.username}</div>
			<div className='containerCheck'>
				<div className='noButton' />
			</div>
		</div>
	)
}

export default FriendReqOnglet