import React from 'react'
import '../Font.css'
import { historyData } from './typeHistory'
import { CSSProperties, Component } from 'react'

interface Props {
    entry: historyData;
}

const HistoryEntry:React.FC<Props> = ({entry}) => {
  
    const win =  entry.victory === 'VICTORY';

    const history: CSSProperties = {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '15px',      
        flexBasis: '100px',
        margin: '10px',
        marginBottom: '0px',
        marginTop: '5px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: 'prompt',
        fontWeight : '800',
        letterSpacing : '5px',
        color: '#fff',
    }
        const histo1: CSSProperties = {
            flexBasis: '250px',
            margin: '2px',
            display: 'flex',
            flexDirection: 'column',
        }
            const victory: CSSProperties = {
                fontSize: '40px',
                letterSpacing : '10px',
                textAlign: 'left',
                padding: '5px',
                background: win ? 'linear-gradient(to bottom, #63E9FF 20%, #00FBB0)' :
                'linear-gradient(to bottom, red, #9A08B1 60%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: win ? "0 0 30px #63E9FF, 0 0 100px #63E9FF, 0 0 150px #63E9FF" : "0 0 30px red, 0 0 100px red, 0 0 150px red"
            }
            const modeDate: CSSProperties = {
                fontSize: '15px',
                fontWeight : '600',
                textAlign:'left',
                padding:'10px',
                paddingTop: '0px',
                display:'flex',
                justifyContent: 'space-between',
            }

        const histo2: CSSProperties = {
            flexBasis: '200px',
            margin: '2px',
            fontSize:' 40px',
            textAlign: 'center',
            paddingTop:' 15px',
            color: win ? '#63E9FF' : 'red',
            textShadow: win ? "0 0 30px #63E9FF, 0 0 100px #63E9FF, 0 0 150px #63E9FF" : "0 0 30px red, 0 0 100px red, 0 0 150px red",
        }

        const histo3: CSSProperties = {
            flexBasis: '100px',
            margin:' 2px',
            fontSize: '24px',
            textAlign: 'right',
            paddingTop: '30px',
        }

        const histo4: CSSProperties = {
            flexGrow: '1',
            margin: '2px',
            paddingRight: '10px',

            display: 'flex',
            flexDirection: 'column',
        }
            const adversary: CSSProperties = {
                fontSize: '25px',
                textAlign: 'right',
                paddingTop: '25px',
                background: win ? 'linear-gradient(to bottom, #63E9FF 70%, #00FBB0)' :
                'linear-gradient(to bottom, red, #9A08B1 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: win ? "0 0 30px #63E9FF, 0 0 100px #63E9FF, 0 0 150px #63E9FF" : "0 0 30px red, 0 0 100px red, 0 0 150px red",
            }
            const elo: CSSProperties = {
                textAlign:'right',
                display: 'flex',
                justifyContent: 'flex-end',            
                paddingTop: '5px',
                fontWeight : '600',

            }
                const nbr: CSSProperties = {
                    flexBasis: '40px',
                }
                const icon: CSSProperties = {
                    flexBasis: '40px',
                }

    return (
    <div style={history}>
        <div style={histo1}>
            <span style={victory}>{entry.victory}</span>
            <div style={modeDate}>
                <span> Mode {entry.mode} </span>
                <span> {entry.date} </span>
            </div>
        </div>

        <div style={histo2}> {entry.userPoints} - {entry.advPoints} </div>

        <div style={histo3}> VS </div>

        <div style={histo4}>
            <span style={adversary}> {entry.adversary} </span>
            <div style={elo}>
                {entry.elo >= 0 ?
                 <span style={nbr}> +{entry.elo}</span> 
                 : <span style={nbr}> {entry.elo}</span>}
                <span style={icon}>ELO</span>
            </div>
        </div>
    </div>
  )
}

export default HistoryEntry
