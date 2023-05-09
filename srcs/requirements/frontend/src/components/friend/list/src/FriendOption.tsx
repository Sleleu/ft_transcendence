import React from 'react'
import '../css/FriendOption.css'
import { User } from '../../../types'
import FriendOptionOnglet from './FriendOptionOnglet'

type propsOption = {
    token: string
    friend: User
    changeComponent: (component: string) => void;
}


const FriendOption = ({ token, friend, changeComponent }: propsOption) => {

    return (
        <div className='containerFriendOption'>
            {friend.state.startsWith("is") && <FriendOptionOnglet changeComponent={changeComponent} context='watchGame' txt='Watch Game' pathImg='url(../../../../img/yes.png)' friend={friend} />}
        </div>
    )
}

export default FriendOption