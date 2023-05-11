import React from 'react'
import '../css/FriendOptionOnglet.css'
import { User } from '../../../types';


type PropsOnglet = {
    txt: string;
    context: string;
    changeComponent: (component: string) => void;
    friend: User
    token: string
    update: () => void;
    change: (compo: string) => void
}

const FriendOptionOnglet = ({ changeComponent, context, txt, friend, token, update, change }: PropsOnglet) => {

    const handleClick = () => {
        if (context === 'watchGame')
            watchGame()
        else if (context === 'sendMessage')
            sendMessage()
        else if (context === 'block')
            block()
        else if (context === 'invitePlay')
            invitePlay()
        else if (context === 'removeFriend')
            removeFriend()
    }

    const removeFriend = async () => {
        const req = 'http://localhost:5000/friend/delete/' + friend.id
        await fetch(req, { method: "DELETE", credentials: "include" })
        update()
        change('add')
    }

    const invitePlay = () => {
    }

    const block = () => {
    }

    const sendMessage = () => {
    }

    const watchGame = () => {
        const compo = "watch" + friend.id
        changeComponent(compo)
    }

    let imageUrl = require('../../../../img/yes.png')
    if (context === 'watchGame')
        imageUrl = require('../../../../img/watch.png')
    else if (context === 'sendMessage')
        imageUrl = require('../../../../img/menue/chat.png')
    else if (context === 'block')
        imageUrl = require('../../../../img/bloque.png')
    else if (context === 'invitePlay')
        imageUrl = require('../../../../img/invite.png')
    else if (context === 'removeFriend')
        imageUrl = require('../../../../img/remove.png')

    const style = {
        backgroundImage: `url(${imageUrl})`,
        minHeight: '36px',
        minWidth: '36px',
    }

    const styleImage = {
        backgroundImage: `url(${imageUrl})`,
        minHeight: '30px',
        minWidth: '30px',
    }

    const padding = {
        paddingLeft: '15px'
    }

    return (
        <div className='containerFriendOptionOnglet' onClick={handleClick}>
            <div className='nameText' style={padding}>{txt}</div>
            {context === 'sendMessage' ?
                (<div className='image' style={styleImage} />) :
                (<div className='image' style={style} />)
            }
        </div>
    )
}

export default FriendOptionOnglet