import React from 'react'
import '../css/FriendAdd.css'

const FriendAdd = () => {

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
    }

    return (

        <div className='containerAddFriendInside'>
            <div className='containerAddFriendHeader'>
                <input style={inputStyle} className='inputFriend' type='text' placeholder='NewFriendName' />
                <div style={loopStyle} className='loopButton' />
            </div>
        </div>
    )
}

export default FriendAdd