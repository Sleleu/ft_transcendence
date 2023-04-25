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

      const ratio : number = user.win + user.loose === 0 ? 0 : (user.win  / (user.win + user.loose) * 100); 

    return (
        <div style={StatVictory}>
            <span>Victories</span>
            <div style={Center}>
                <span>{ratio}</span>
                <span>%</span>
            </div>
            <div style={Bottom}>
                <div style={textCrown}>
                    <img src={crown} alt='crown' style={Crown}/>
                    <span>{user.win} W</span>
                </div>
                <div style={textSkull}>
                    <img src={skull} alt='skull' style={Skull}/>
                    <span>{user.loose} D</span>
                </div>
            </div>
        </div>
    );
}

export default StatVictory
