import '../css/FriendRequest.css'
import React, { FC, CSSProperties } from 'react'
import { useState, useEffect } from 'react';
import { User } from '../../../types';
import FriendReqOnglet from './FriendReqOnglet';

interface friendReq {
    id: number;
    senderId: number;
    recipientId: number;
    sender: User
}


const FriendRequest = ({ sender }: { sender: friendReq[] }) => {
    return (
        <div className='containerFriendReq'>
            {sender.length === 0 ? (
                <div className='noFriendReq'>
                    <div className='nameText'>Friends Requests will apear here !</div>
                </div>
            ) : (
                sender.map((sender) =>
                    <FriendReqOnglet key={sender.id} sender={sender.sender} />)
            )}
        </div>
    )
}

export default FriendRequest