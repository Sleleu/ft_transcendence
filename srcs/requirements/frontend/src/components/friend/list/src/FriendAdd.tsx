import React, { FormEvent } from 'react'
import { useState, useEffect } from 'react';
import '../css/FriendAdd.css'
import { User } from '../../../types';

const FriendAdd = ({ token }: { token: string }) => {

    const inputStyle = {
        width: '70%',
        height: '72%',
        fontSize: '2.2vh',
    }

    const loopStyle = {
        minHeight: '40px',
        minWidth: '42px',
        height: '3.5vh',
        width: '3.6vh',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
    }

    interface FriendInterface {
        id: number;
        createdAt: string;
        userId: number
        friendId: number
        friend: User
    }

    const [input, setInput] = useState<string>('')
    const [friendList, setFriendList] = useState<FriendInterface[]>([])

    const fetchFriendsList = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!input)
            return;
        const bear = 'Bearer ' + token
        const req = 'http://localhost:5000/friend/add/' + input
        const data = await fetch(req, { method: "GET", headers: { 'Authorization': bear } })
        const friend = await data.json()
        setFriendList(friend)
    }

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value)
    }

    return (

        <div className='containerAddFriendInside'>
            <form className='containerAddFriendHeader' onSubmit={fetchFriendsList}>
                <input style={inputStyle} className='inputFriend' type='text' placeholder='NewFriendName' onChange={handleInput} />
                <button style={loopStyle} className='loopButton' type='submit' />
            </form>
            <div className='containerAddFriendBody'>
                {friendList.length === 0 ? (
                    <p>oui egale a 0</p>
                ) : (
                    <p>non</p>
                )}
            </div>
        </div>
    )
}

export default FriendAdd