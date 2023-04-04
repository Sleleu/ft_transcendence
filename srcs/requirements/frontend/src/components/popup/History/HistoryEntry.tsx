import React from 'react'
import './History.css'
import { historyData } from './typeHistory'
import { CSSProperties, Component } from 'react';

interface Props {
    entry: historyData;
}

const HistoryEntry:React.FC<Props> = ({entry}) => {
  
    const winLoose =  entry.victory === 'VICTORY' ? 'lightgreen' : 'red';

    const styleVictory: CSSProperties = {
        fontSize: '40px',
        textAlign: 'left',
        padding: '5px',
        background: 'linear-gradient(to bottom, var(--winLoose) 20%, rgb(0, 0, 0))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    }

    return (
    <div className='historyEntry' style={{'--winLoose': winLoose} as React.CSSProperties}>
        <div className='histo1'>
            <span style={styleVictory}>{entry.victory}</span>
            <div className='modeDate'>
                <span> Mode {entry.mode} </span>
                <span> {entry.date} </span>
            </div>
        </div>

        <div className='histo2'> {entry.userPoints} - {entry.advPoints} </div>

        <div className='histo3'> VS </div>

        <div className='histo4'>
            <span className='adversary'> {entry.adversary} </span>
            <div className='elo'>
                {entry.elo >= 0 ?
                 <span className='nbr'> +{entry.elo}</span> 
                 : <span className='nbr'> {entry.elo}</span>}
                <span className='icon'>ELO</span>
            </div>
        </div>
    </div>
  )
}

export default HistoryEntry
