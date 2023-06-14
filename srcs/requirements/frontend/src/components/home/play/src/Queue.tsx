import React, { useEffect, useState } from 'react'
import { BarWave, Messaging } from "react-cssfx-loading";
import '../css/Queue.css'
import { Socket } from 'socket.io-client';

interface props {
    mode: string
    name: string
    socket?: Socket
    changeComponent: (str: string) => void
}

interface Opponent {
    username: string
    id: number
}

const Queue = ({ mode, name, socket, changeComponent }: props) => {
    const [find, setFind] = useState(false)
    const [vs, setVs] = useState('void')
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        const emitStr = 'addQueue' + mode
        const quit = 'quitQueue' + mode
        socket?.emit(emitStr, {})
        socket?.on('vsName', async ({ opponent }: { opponent: Opponent }) => {
            await delay(2000)
            setFind(true)
            setVs(opponent.username)
            await delay(3000)
            const change = 'game' + opponent.id + mode;
            changeComponent(change)
        })
        return () => {
            socket?.off('vsName')
            socket?.emit(quit, {})
        }
    }, [])

    const modeStr = () => {
        if (mode === 'n')
            return 'Normal Mode'
        else
            return 'Bonus Mode'
    }
    return (
        <div className='containerQueue'>
            {!find ? (<div className='headerQ'>Looking For An Opponent</div>) :
                (<div className='headerQ'>Match is about to Start</div>)}
            < div className='containerBotQ'>
                <div className='headerBotQ'>{modeStr()}</div>
                <div className='containerQ'>
                    <div className='containerName'>
                        <div>{name}</div>
                    </div>
                    <div className='containerPong'>
                        <div className='bloc'></div>
                        <div className='ball'></div>
                        <div className='bloc2'></div>
                    </div>
                    <div className='containerName'>
                        {!find ? (<Messaging color='#FFFFFF' />) :
                            (<div>{vs}</div>)}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Queue
