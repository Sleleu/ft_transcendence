import React, { useState } from "react";
import { enableTwoFAVerified, verifyTwoFACode } from "../Api";
import AuthCode from 'react-auth-code-input';
import { CSSProperties } from "styled-components";
import './Login.css'
import Lock from './../../img/et_lock.svg'

const Container: CSSProperties = {
	height: '70%',
	width: '30%',
	backgroundColor: 'rgba(0, 0, 0, 0.8)',
	borderRadius: '30px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	fontWeight: '1000',
	fontFamily: 'Montserrat, sans-serif',
	color: '#FFFFFF',
	textAlign: 'center',
	textShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
	padding: '20px',
};

const Form: CSSProperties = {
	width: '80%',
	margin: '20px 0',
};

const Button: CSSProperties = {
	backgroundColor: 'rgba(255, 255, 255, 0.1)',
	color: 'white',
	padding: '15px 32px',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: '16px',
	margin: '4px 2px',
	cursor: 'pointer',
	border: '2px',
	borderRadius: '4px',
	borderBlockColor: 'white',
	boxShadow: '0 0 10px cyan, 0 0 10px cyan, 0 0 10px cyan, 0 0 10px cyan',
	textShadow: '0 0 5px white, 0 0 10px cyan'
};


const AuthCodeContainer: CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	margin: '20px 0',
	flexDirection: 'row'
  };

interface Verify2FAProps {
  onVerifySuccess: () => void;
}

const Verify2FA: React.FC<Verify2FAProps> = (props) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (code: string) => {
    setCode(code);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await verifyTwoFACode(code);
      await enableTwoFAVerified();
      setError(null);
      props.onVerifySuccess();
    } catch (error) {
      setError("Invalid 2FA code.");
      setMessage(null);
    }
  };

  return (
	<div className="baground">
	  <div className='containerFullPage'>
		<div style={Container}>
		  <img src={Lock} className="lock-image" />
	      <h1>Verify 2FA</h1>
	      <form onSubmit={handleSubmit} style={Form}>
			<h3>This account has two-factor authentication enabled.</h3>
	        <label>
	          Enter your 2FA code:
	        </label>
	        <div style={AuthCodeContainer}>
	          <AuthCode containerClassName="auth-code-container" inputClassName="auth-code-input-cell" allowedCharacters="numeric" onChange={handleInputChange}/>
	        </div>
	        <button type="submit" style={Button} className="neon-button" >Verify</button>
	      </form>
	      <div style={{width: '80%'}}>
	        {error && <p style={{ color: "red" }}>{error}</p>}
	        {message && <p style={{ color: "green" }}>{message}</p>}
	      </div>
	    </div>
	  </div>
	</div>
  );
}

export default Verify2FA;
