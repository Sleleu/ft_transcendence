import React from 'react'
import '../css/FriendOption.css'
import { User } from '../../../types'
import FriendOptionOnglet from './FriendOptionOnglet'
import FriendOnglet from './FriendOnglet'

type propsOption = {
    friend: User
    changeComponent: (component: string) => void;
    update: () => void;
    change: (compo: string) => void
}


const FriendOption = ({ friend, changeComponent, update, change }: propsOption) => {

    return (
        <div className='containerFriendOption'>
            <FriendOnglet friend={friend} switchComponent={(id: number) => (id)} />
            {friend.state.startsWith("is") && <FriendOptionOnglet changeComponent={changeComponent} context='watchGame' txt='Watch Game' friend={friend} update={update} change={change} />}
            <FriendOptionOnglet changeComponent={changeComponent} context='sendMessage' txt='Send Messages' friend={friend} update={update} change={change} />
            <FriendOptionOnglet changeComponent={changeComponent} context='invitePlay' txt='Invite To play' friend={friend} update={update} change={change} />
            <FriendOptionOnglet changeComponent={changeComponent} context='removeFriend' txt='Remove this User' friend={friend} update={update} change={change} />
            <FriendOptionOnglet changeComponent={changeComponent} context='block' txt='Block this User' friend={friend} update={update} change={change} />
        </div>
    )
}

export default FriendOption