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

const FriendRequest = ({ sender, update }: { sender: friendReq[], update: () => void }) => {

    const [req, setReq] = useState<friendReq[]>(sender)

    const handleRemoveFromReq = (senderId: number) => {
        setReq(req.filter(request => request.senderId !== senderId))
    }

    const style = {
        paddingLeft: '15%',
        paddingRight: '15%',
        textShadow: 'none',
    }

    return (
        <div className='containerFriendReq'>
            {sender.length === 0 ? (
                <div className='noFriendReq'>
                    <div style={style} className='nameText'>Friends Requests will apear here !</div>
                </div>
            ) : (
                req.map((sender) =>
                    <FriendReqOnglet key={sender.id} sender={sender.sender} onRemove={() => handleRemoveFromReq(sender.senderId)} update={update} />)
            )}
        </div>
    )
}

export default FriendRequest