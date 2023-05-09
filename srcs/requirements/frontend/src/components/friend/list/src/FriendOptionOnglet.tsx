import React from 'react'
import '../css/FriendOptionOnglet.css'
import { User } from '../../../types';


type PropsOnglet = {
    pathImg: string;
    txt: string;
    context: string;
    changeComponent: (component: string) => void;
    friend: User
}

const FriendOptionOnglet = ({ changeComponent, context, txt, pathImg, friend }: PropsOnglet) => {

    const handleClick = () => {
        if (context === 'watchGame')
            watchGame()
        else if (context === 'seeProfile')
            seeProfile()
        else if (context === 'sendMessage')
            sendMessage()
        else if (context === 'block')
            block()
        else if (context === 'invitePlay')
            invitePlay()
        else if (context === 'removeFriend')
            removeFriend()
    }

    const removeFriend = () => {
    }

    const invitePlay = () => {
    }

    const block = () => {
    }

    const sendMessage = () => {
    }

    const seeProfile = () => {
    }

    const watchGame = () => {
        const compo = "watch" + friend.id
        changeComponent(compo)
    }

    const style = {
        backgroundImage: `url(${require('../../../../img/yes.png')})`,
        minHeight: '36px',
        minWidth: '32px',
    }

    const padding = {
        paddingLeft: '15px'
    }

    return (
        <div className='containerFriendOptionOnglet' onClick={handleClick}>
            <div className='nameText' style={padding}>{txt}</div>
            <div className='image' style={style}></div>
        </div>
    )
}

export default FriendOptionOnglet