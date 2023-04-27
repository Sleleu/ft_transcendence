import React from 'react'
import '../css/FriendOnlget.css'
import { User } from '../../../types'
import calculRank from '../../../utils'
import { relative } from 'path'

const FriendOnglet = ({ friend }: { friend: User }) => {

    const rankLogo = {
        position: 'relative' as const,
        marginBottom: '3%',
    }

    const colorStat = (state: string) => {
        if (state !== 'offline')
            return '#30FF83'
        else
            return '#D96161'
    }

    const colorAvatar = (state: string) => {
        if (state !== 'offline')
            return '1'
        else
            return '0.3'
    }

    const nameFriend = {
        fontSize: '40px',
    }

    const stateFriendTxt = {
        color: `${colorStat(friend.state)}`,
    }

    const avatarOpacity = {
        opacity: `${colorAvatar(friend.state)}`
    }

    return (
        <div className='containerFriendOnglet'>
            <div style={rankLogo} className={calculRank(friend.elo)} />
            <div className='containerTextFriendName'>
                <div style={nameFriend} className='nameText' >{friend.username}</div>
                <div style={stateFriendTxt} className='stateFriend'>{friend.state}</div>
            </div>
            <div style={avatarOpacity} className='containerAvatarFriend'>
                <div className='avatar' />
            </div>
        </div>
    )
}

export default FriendOnglet