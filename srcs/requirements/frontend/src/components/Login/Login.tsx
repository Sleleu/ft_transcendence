import React, {useState, useEffect, useRef} from 'react'
import { CSSProperties } from 'react'
import CreateAccount from './CreateAccount';
import LogPage from './LogPage';
import '../home/Home.css'

interface Props {
    updateToken: (token: string) => void;
	login: () => void;
}
interface Account {
    username: string,
    password: string,
}

const Login:React.FC<Props> = ({updateToken, login}) => {

    const [page, setPage] = useState<string>('log');

  return (
    <div className="baground">
        <div className='containerFullPage'>
        {page === 'log' && <LogPage updateToken={updateToken} setPage={setPage} login={login}/>}
        {page === 'register' && <CreateAccount updateToken={updateToken} setPage={setPage}/>}
        </div>
    </div>
  )
}

export default Login
