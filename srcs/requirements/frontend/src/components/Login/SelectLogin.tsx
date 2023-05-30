import React, { useState } from 'react';
import './Login.css';
import { User } from '../types';

interface SelectLoginProps {
  user: User;
}

const SelectLogin: React.FC<SelectLoginProps> = ({user}) => {
  const [gameLogin, setGameLogin] = useState(user.gameLogin || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`New game login is ${gameLogin}`);
    setError(null);
    try {
        const response = await fetch('http://localhost:5000/users/update-gameLogin', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ gameLogin }),
            credentials: "include",  
        });
        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || 'Something went wrong');
            return;
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            setError(error.message);
        }
    }
}

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameLogin(event.target.value);
  }

  return (
    <div className="baground">
      <div className='containerFullPage'>
        <div className='container'>
          <div style={{width: '80%'}}>
            <img className='avatar-login' src={user.avatar} />
            <h1>Welcome, {user.username}!</h1>
            <h2>Please enter your new game login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={gameLogin}
                onChange={handleChange}
              />
              <button className='button' type="submit">Confirm</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectLogin;
