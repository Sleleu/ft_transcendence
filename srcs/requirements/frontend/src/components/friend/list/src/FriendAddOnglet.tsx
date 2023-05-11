import React from 'react'
import '../css/FriendAddOnglet.css'
import { User } from '../../../types';
import { useState, useEffect } from 'react';

const FriendAddOnglet = ({ friend, token }: { friend: User, token: string }) => {


    const [button, setButton] = useState<boolean>(false)

    const handleClick = async () => {
        setButton(true)
        const req = 'http://localhost:5000/friend/send/' + friend.id
        await fetch(req, { method: "POST", credentials: "include"})
    }

    const nameFriend = {
        fontSize: '20px',
        paddingLeft: '3%'
    }

    const displayButtonOpacity = () => {
        if (button)
            return '0.4'
        else
            return '1'
    }

    const friendLogomo = {
        minHeight: '30px',
        minWidth: '30px',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        opacity: `${displayButtonOpacity()}`
    }


    return (
        <div className='containerAddOnglet'>
            <div style={nameFriend} className='nameText'>{friend.username}</div>
            <button style={friendLogomo} className='addFriendLogo' onClick={handleClick} />
        </div>
    )
}

export default FriendAddOnglet