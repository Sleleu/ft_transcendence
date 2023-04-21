import React, {useState, useEffect, useRef} from 'react'
import { CSSProperties } from 'react'
import CreateAccount from './CreateAccount';
import { useNavigate } from "react-router-dom"

interface Props {
    updateToken: (token: string) => void;
    setPage: React.Dispatch<React.SetStateAction<string>>;
}
interface Account {
    username: string,
    password: string,
}

const LogPage:React.FC<Props> = ({updateToken, setPage}) => {

    const [inputLog, setInputLog] = useState<string>('');
    const [inputPass, setInputPass] = useState<string>('');
    const [hover, setHover] = useState<boolean>(false);
    const [click, setClick] = useState<string>('');

    const Container : CSSProperties = {   
        height: '70%', width: '30%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '30px',

        display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignContent:'center', 

        fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF',
    }
    const Title : CSSProperties = {   
        alignSelf: 'center', fontSize: '40px',
    }
    const Input : CSSProperties = {   
        display: 'flex', flexDirection: 'column' , justifyContent: 'space-around', 
        paddingTop: '10%',
        paddingBottom: '10%',
        width: '100%',
        height: '100%',
        position: 'relative',
        alignItems: 'center',
    }
    const InputBox : CSSProperties = {   
        width: '56%',
        height: '1%',
        borderRadius: '15px',
        padding: '20px 30px',
        fontSize: '25px',
        border: 'none',
        boxShadow: 'inset 0 0 7px black',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        zIndex: 1,
    }
    const Buttons : CSSProperties = {   
        display: 'flex', justifyContent: 'space-between',
        width: '65%',
    }
    const BoxLog : CSSProperties = {   
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        width: '45%', height: '110%', borderRadius: '5px',
        padding: '4%',
        fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: '#fff',
        
        border: 'none',
        textAlign: 'center',
        zIndex: 1, cursor: hover ? 'pointer' : 'auto',
    }
    const Box42 : CSSProperties = {   
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: '45%', height: '110%', borderRadius: '5px',
        padding: '4%',
        fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: '#000',

        border: 'none',
        textAlign: 'center',
        zIndex: 1, cursor: hover ? 'pointer' : 'auto',
    }
    const BoxRegister : CSSProperties = {   
        backgroundColor: 'rgba(100, 220, 255, 0.6)',
        width: '65%', height: '8%', borderRadius: '5px',
        textAlign: 'center',
        border: 'none',
        fontSize: '20px', fontWeight: '400px', fontFamily: 'Montserrat, sans-serif', color: '#fff',
        zIndex: 1, cursor: hover ? 'pointer' : 'auto',
    }

    const inputRef = useRef<HTMLInputElement>(null);

    const handleLog = (event:React.ChangeEvent<HTMLInputElement>) => {
        setInputLog(event.target.value);
    };
    const handlePass = (event:React.ChangeEvent<HTMLInputElement>) => {
        setInputPass(event.target.value);
    };
    const handleHover = () => {
        setHover(!hover);
    };
    const handleClick = (button: string) => {
        setClick(button);
    };
    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        setInputLog('');
        setInputPass('');
        if (click === 'register')
            setPage('register');
        if (click === '42')
            console.log('LOG WITH 42');
        if (click === 'log')
        {
            const response = logAccount({username: inputLog, password: inputPass});
            response.then((result:boolean) => {
                if (result) {
                    console.log('LogPage : To Home');
                    // navigate('/home');
                    return ;
                }
                console.log('LogPage : Bad Response');
            })
        }
    };

    const logAccount = async (data: Account) => {
        try {
            const response = await fetch("http://localhost:5000/auth/signin" , { method:"POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
            if (response.status === 200)
            {
                const jsonData = await response.json()
                updateToken(jsonData.access_token)
                return true;
            }
            console.log('LogPage: Status Error code : %d', response.status);
            return false;
        }
        catch(error) {
            console.error('LogPage: Failed to send data:', error);
            return false;
        }
    }

  return (
    <div style={Container}>
        <form style={Input} onSubmit={handleSubmit}>
            <span style={Title}>King Pong</span>
            <input ref={inputRef} style={InputBox} type='input' placeholder='Username' value={inputLog} onChange={handleLog}/>
            <input style={InputBox} type='password' placeholder='Password' value={inputPass} onChange={handlePass}/>
            <div style={Buttons}>
                <button style={BoxLog} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={() => handleClick('log')}>Login</button>
                <button style={Box42} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={() => handleClick('42')}>Log with 42</button>            
            </div>
            <span>New User ?</span>            
            <button style={BoxRegister} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={() => handleClick('register')}>Register</button>            
        </form>
    </div>
  )
}

export default LogPage
