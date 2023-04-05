import React from 'react'
import '../Font.css'
import { historyData } from './typeHistory'
import { CSSProperties, Component } from 'react'
import Neon from '../Neon'

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
        fontFamily: 'montserrat',
        fontWeight : '800',
        letterSpacing : '5px',
        color: '#fff',
    }
        const histo1: CSSProperties = {
            flexBasis: '300px',
            margin: '2px',
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '8px',
        }
            const victory: CSSProperties = {
                fontSize: '40px',
                letterSpacing : '10px',
                textAlign: 'left',
                padding: '5px',
                paddingTop: '10px',
                paddingLeft: '14px',
                background: win ? 'linear-gradient(to bottom, #63E9FF 20%, #00FBB0 60%)' :
                'linear-gradient(to bottom, #9A08B1 , #FC3030 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }
            const modeDate: CSSProperties = {
                fontSize: '15px',
                fontWeight : '600',
                textAlign:'left',
                padding:'10px',
                paddingTop: '0px',
                paddingRight: '40px',
                display:'flex',
                justifyContent: 'space-around',
                letterSpacing : '1px',
            }

        const histo2: CSSProperties = {
            flexBasis: '200px',
            margin: '2px',
            fontSize:' 40px',
            textAlign: 'center',
            paddingTop:' 15px',
            background: win ? 'linear-gradient(to bottom, #63E9FF 20%, #00FBB0 60%)' :
            'linear-gradient(to bottom, #9A08B1 , #FC3030 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: win ? "0 0 30px #63E9FF, 0 0 100px #63E9FF, 0 0 150px #63E9FF" : "0 0 30px #FC3030, 0 0 100px #FC3030, 0 0 150px #FC3030",
        }

        const histo3: CSSProperties = {
            flexBasis: '100px',
            margin:' 2px',
            fontSize: '24px',
            textAlign: 'right',
            paddingTop: '30px',
            background: win ? 'linear-gradient(to bottom, #63E9FF 20%, #00FBB0 60%)' :
            'linear-gradient(to bottom, #9A08B1 , #FC3030 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: win ? "0 0 30px #63E9FF, 0 0 100px #63E9FF, 0 0 150px #63E9FF" : "0 0 30px #FC3030, 0 0 100px #FC3030, 0 0 150px #FC3030"
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
                'linear-gradient(to bottom, #9A08B1 , #FC3030 200%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: win ? "0 0 30px #63E9FF, 0 0 100px #63E9FF, 0 0 150px #63E9FF" : "0 0 30px #FC3030, 0 0 100px #FC3030, 0 0 150px #FC3030",
            }
            const elo: CSSProperties = {
                textAlign:'right',
                display: 'flex',
                justifyContent: 'flex-end',            
                paddingTop: '5px',
                fontWeight : '600',
                color : win ? 'lightgreen' : 'coral',
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
            <span style={victory}> {entry.victory} </span>
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
