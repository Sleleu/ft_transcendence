import React, {useState} from 'react'
import CreateAccount from './CreateAccount';
import LogPage from './LogPage';
import '../home/Home.css'

interface Props {
    updateToken: (token: string) => void;
}
interface Account {
    username: string,
    password: string,
}

const Login:React.FC<Props> = ({updateToken}) => {

    const [page, setPage] = useState<string>('log');

  return (
    <div className="baground">
        <div className='containerFullPage'>
        {page === 'log' && <LogPage updateToken={updateToken} setPage={setPage}/>}
        {page === 'register' && <CreateAccount updateToken={updateToken} setPage={setPage}/>}
        </div>
    </div>
  )
}

export default Login
