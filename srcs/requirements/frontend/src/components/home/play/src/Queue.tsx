import React, { useEffect, useState } from 'react'
import { BarWave, Messaging } from "react-cssfx-loading";
import '../css/Queue.css'

interface props {
    mode: string
    name: string
}

const Queue = ({ mode, name }: props) => {


    const [find, setFind] = useState(false)
    const [vs, setVs] = useState('void')
    useEffect(() => {

    }, [])

    return (
        <div className='containerQueue'>
            <div className='headerQ'>Looking For An Opponent</div>
            <div className='containerBotQ'>
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
    )
}

export default Queue