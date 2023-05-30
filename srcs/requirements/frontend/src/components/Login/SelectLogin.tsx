import React from 'react';
import './Login.css'
import { User } from '../types';
import './Login.css'

interface SelectLoginProps {
	user: User;
  }

const SelectLogin: React.FC<SelectLoginProps> = ({user}) => {

  return (
	<div className="baground">
	  <div className='containerFullPage'>
		<div className='container'>
	      <div style={{width: '80%'}}>
			<img className='avatar' src={user.avatar} />
		  	<h1> Welcome, {user.username} ! </h1>
			<h2> Please enter your new login </h2>

			<button className='button'>Confirm</button>
	      </div>
	    </div>
	  </div>
	</div>
  );
}

export default SelectLogin;
