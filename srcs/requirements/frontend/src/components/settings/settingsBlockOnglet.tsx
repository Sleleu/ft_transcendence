import React from 'react'
import { User } from '../types'

interface blocked {
    senderId: number
    sender: User
    recipientId: number
    recipient: User
    id: number
}

const SettingsBlockOnglet = ({block}: {block: blocked}) => {
    return (
        <div></div>
    )
}

export default SettingsBlockOnglet