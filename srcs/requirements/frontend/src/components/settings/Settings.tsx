import React, { CSSProperties, Component } from 'react';
import { useState } from 'react';
import './Settings.css'
import '../../css/Text.css'
import { useNavigate } from 'react-router-dom';

/* Side bar svg */
import settings_svg from '../../img/settings.svg';
import return_svg from '../../img/return.svg';
import frog_svg from '../../img/frog.svg';
import username_svg from '../../img/username.svg';
import block_svg from '../../img/block.svg';
import password_svg from '../../img/password.svg';
import lock_svg from '../../img/lock.svg';
import {User} from '../types'

import {Cont, HeaderBar} from '../container/container'
import {SettingsUsername, SettingsAvatar, SettingsBlock, SettingsLock} from './Options'
import SettingsPassword from './settingsPassword';

type Props = {
	image?: string;
	text?: string;
	onClick?: () => void;
}

type SettingsOptionsProps = {
	setSelectedOption: (option: string) => void;
	setShowOptions: (show: boolean) => void;
  };

const SettingsTitle = () => {
	return (
		<div className='display-settings'>
			<div className='symbol'>
				<img src={settings_svg} className='vector-neon'/>
			</div>
			<div>
				<p className='text big bold cyan-stroke'>Settings</p>
			</div>
		</div>
	);
}

const ReturnButton = () => {
	const navigate = useNavigate();
	return (
		<button className='btn' onClick={() => navigate("/")}>
			<img src={return_svg} className='vector-neon'/>
		</button>
	);
}

const SettingsOptions = ({setSelectedOption, setShowOptions}: SettingsOptionsProps) => {
	
	const handleOptionClick = (option: string) => {
		setSelectedOption(option);
		setShowOptions(true);
	  };

	return (
		<React.Fragment>
		<Cont padding='0px' width='45%' height='39px' borderBottom='1px solid white'>
			<Option text='Profile'/>
		</Cont>
		<ButtonOption image={frog_svg} text='Avatar' onClick={() => handleOptionClick("avatar")}/>
		<ButtonOption image={username_svg} text='Username' onClick={() => handleOptionClick("username")}/>
		<ButtonOption image={block_svg} text='Blocked users' onClick={() => handleOptionClick("block")}/>
		<Cont  padding='0px' width='95%' height='38px' borderBottom='1px solid white'>
			<Option text='Confidentiality'/>
		</Cont>
		<ButtonOption image={password_svg} text='Change password' onClick={() => handleOptionClick("password")}/>
		<ButtonOption image={lock_svg} text='2FA authentication'onClick={() => handleOptionClick("lock")}/>
		</React.Fragment>
	);
}

const Option = ({text}: Props) => {
	return (
		<div style={{ marginTop: '-28px', zIndex: '0' }}>
    		<p className='text big bold purple-stroke'>{text}</p>
		</div>
	);
}

const ButtonOption = ({ image, text, onClick}: Props) => {
  const [hovered, setHovered] = React.useState(false);

  const handleTextClick = () => {
		if (onClick)
			onClick();
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const buttonColor = hovered ? 'rgba(255, 255, 255, 0.50)' : 'rgba(0, 0, 0, 0)'; 

  return (
    <button className='btn'
      style={{
		border: 'none',
		justifyContent: 'left',
        display: 'flex',
        flexDirection: 'row',
        padding: '5px',
        gap: '10px',
        width: '175px',
        height: '42px',
		zIndex: '1',
		backgroundColor: buttonColor
      }}
	  onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
	  onClick={handleTextClick} // call le onclick de props
    >
      <img src={image} />
      <p className='text bold'>{text}</p>
    </button>
  );
};

function Settings({ user }: { user: User }) {

	const [selectedOption, setSelectedOption] = useState(''); // stock l'option selectionnee
	const [showOptions, setShowOptions] = useState(false);

	return (
        <div className="Home">
			<Cont width='50vw' height='40vh' direction='column' borderRadius='15px' backgroundColor='rgba(0, 0, 0, 0.75)' minWidth='679px' minHeight='425px'>
				<HeaderBar borderBottom='1px solid #ffffff'>
					<SettingsTitle /> <ReturnButton />
				</HeaderBar>
				<Cont width='100%' height='100%'direction='row'>
					<Cont borderRight='1px solid #ffffff' minHeight='330px' width='25vw' height='80%' borderRadius='15px' >
						<SettingsOptions setSelectedOption={setSelectedOption} setShowOptions={setShowOptions} />
					</Cont>
					<Cont minWidth='270px' minHeight='340px' width='75vw' height='38vh' alignItems='center'>
						{selectedOption === "username" && showOptions && <SettingsUsername user={user} />}
						{selectedOption === "avatar" && showOptions && <SettingsAvatar />}
						{selectedOption === "block" && showOptions && <SettingsBlock />}
						{selectedOption === "password" && showOptions && <SettingsPassword />}
						{selectedOption === "lock" && showOptions && <SettingsLock />}
					</Cont>
				</Cont>
			</Cont>
        </div>
    );
}

export default Settings;
