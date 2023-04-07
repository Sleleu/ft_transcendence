import {useState, ChangeEvent} from 'react';

import reveal_svg from '../../img/reveal.svg'
import hide_svg from '../../img/hide.svg'
import '../../css/Text.css'
import './Settings.css'

interface PasswordInputProps {
	label: string;
	value: string;
	placeholder: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({ label, value, placeholder, onChange }: PasswordInputProps) => {
  const [inputType, setInputType] = useState('password');

  const toggleInputType = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <div className="password">
      <p className='text'>{label}</p>
	  <input className="text bold password-input" type={inputType} value={value} placeholder={placeholder} onChange={onChange} />
      <button className="btn-little" onClick={toggleInputType}>
        <img src={inputType === 'password' ? reveal_svg : hide_svg} alt="toggle" />
      </button>
    </div>
  );
};

const SettingsPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangePassword = () => {
    if (newPassword.length < 12) {
      setErrorMessage('Password need to contain at least 12 characters.');
      return;
    }

	const number = /\d/;
	const special = /[!@#$%^&*(),.?":{}|<>`'=~+-]/;

    if (!number.test(newPassword)) {
		setErrorMessage('Password need to contain at least one numeric characters.');
		return;
	  }
	if (!special.test(newPassword)) {
		setErrorMessage('Password need to contain at least one special character')
		return;
	}
    if (newPassword !== confirmPassword) {
      setErrorMessage('passwords don\'t match');
      return;
    }

    // call nestJS API !

    setErrorMessage('Password successfully changed !');
  };

  return (
    <div className='password-container'>
      <p className='text bold cyan-stroke'>Here you can change your password : </p>
      <PasswordInput
        label="Current password"
        value={currentPassword}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setCurrentPassword(event.target.value)}
		placeholder='password'
      />
      <PasswordInput
        label="New password"
        value={newPassword}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
		placeholder='new password'
      />
      <PasswordInput
        label="Confirm password"
        value={confirmPassword}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
		placeholder='confirm password'
      />
      {errorMessage !== "Password successfully changed !" && <p className="red neon-red">{errorMessage}</p>}
	  {errorMessage === "Password successfully changed !" && <p className="green neon-green">{errorMessage}</p>}
      <button className='btn text bold cyan-stroke password-input' onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default SettingsPassword;