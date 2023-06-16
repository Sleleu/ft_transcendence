import React, {useRef, useState} from 'react'
import CreateAccount from './CreateAccount';
import LogPage from './LogPage';
import '../home/Home.css'
import { CSSProperties } from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface Props {
    updateToken: (token: string) => void;
}
interface Account {
    username: string,
    password: string,
}

const Login:React.FC<Props> = ({updateToken}) => {

    const navigate = useNavigate()
    const [hover, setHover] = useState<boolean>(false);


    const Buttons: CSSProperties = {
        display: 'flex', justifyContent: 'space-between',
        width: '65%',
    }

    const Box42: CSSProperties = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: '45%', height: '110%', borderRadius: '5px',
        padding: '4%',
        fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: '#000',

        border: 'none',
        textAlign: 'center',
        zIndex: 1, cursor: hover ? 'pointer' : 'auto',
    }

    const handleHover = () => {
        setHover(!hover);
    };

    const handleSubmit = () => {
		if (process.env.REACT_APP_AUTH_URL)
		    window.location.href = process.env.REACT_APP_AUTH_URL;
		else
		    console.log('AUTH_URL is undefined');
    };

  return (
    <div className="baground">
      <div className='containerFullPage'>
        <div style={Buttons}>
          <button style={Box42} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={handleSubmit}>Log with 42</button>
        </div>
      </div>
    </div>
  )
}

export default Login
