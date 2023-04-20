import React, {useState, CSSProperties} from 'react';
import { User } from '../../types';
import crown from '../../../img/history/crown.png'
import skull from '../../../img/history/skull.png'

interface Props {
    user: User;
}

const StatVictory: React.FC<Props> = ({user}) => {

    const StatVictory: CSSProperties = {
        flexBasis:'25%', height:'75%', alignSelf:'center',
        background :'rgba(0, 0, 0, 0.7)', borderRadius:'30px',  
        fontWeight:'800', fontSize:'40px', fontFamily:'Montserrat, sans-serif', textAlign:'center', color:'white',
        display:'flex', flexDirection:'column', justifyContent:'space-around',
    }
    const Center: CSSProperties = {
        width:'35%', height:'35%',
        alignSelf:'center', fontSize:'56px',
        position: 'relative',
        display:'flex', flexDirection:'column', justifyContent:'center',

    }
    const Bottom: CSSProperties = {
        width:'70%', height:'25%',
        alignSelf:'center', fontSize:'24px',
        position: 'relative',
        display:'flex', flexDirection:'column', justifyContent:'center',
    }
    const textCrown: CSSProperties = {
       display:'flex', flexDirection: 'row', justifyContent:'center',
       marginLeft:'-9px'
    }
    const Crown: CSSProperties = {
        width:'50px', height:'45px', marginTop:'-5px', marginBottom:'-5px', marginRight:'-6px',
    }
    const textSkull: CSSProperties = {
        display:'flex', flexDirection: 'row', justifyContent:'center', 
     }
     const Skull: CSSProperties = {
         width:'30px', height:'28px', marginTop:'3px', marginRight:'6px',
     }

     // user.victory ?
     // user.defeat ?
     //  const ratio : number = (user.victory  / (user.victory + user.defeat) * 100).toFixed(0); 

    return (
        <div style={StatVictory}>
            <span>Victories</span>
            <div style={Center}>
                <span>25</span>
                <span>%</span>
            </div>
            <div style={Bottom}>
                <div style={textCrown}>
                    <img src={crown} alt='crown' style={Crown}/>
                    <span>126 W</span>
                </div>
                <div style={textSkull}>
                    <img src={skull} alt='skull' style={Skull}/>
                    <span>503 D</span>
                </div>
            </div>
        </div>
    );
}

export default StatVictory
