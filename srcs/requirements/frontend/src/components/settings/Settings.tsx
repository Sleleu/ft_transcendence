import React, { CSSProperties, Component } from 'react';
import { useState } from 'react';
import './Settings.css'
import '../../assets/css/Text.css'
import { useNavigate } from 'react-router-dom';

import settings_svg from '../../assets/img/settings.svg';
import return_svg from '../../assets/img/return.svg';
import frog_svg from '../../assets/img/frog.svg';
import username_svg from '../../assets/img/username.svg';
import block_svg from '../../assets/img/block.svg';
import password_svg from '../../assets/img/password.svg';
import lock_svg from '../../assets/img/lock.svg';
import {Cont, HeaderBar} from '../container/container'

type Props = {
	image?: string;
	text: string;
}

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
			<img src={return_svg} className='vector-neon-return'/>
		</button>
	);
}

const SettingsOptions = () => {
	const navigate = useNavigate();
	return (
		<React.Fragment>
		<Cont padding='0px' width='45%' height='39px' borderBottom='1px solid white'>
			<Option text='Profile'/>
		</Cont>
		<ButtonOption image={frog_svg} text='Avatar'/>
		<ButtonOption image={username_svg} text='Username'/>
		<ButtonOption image={block_svg} text='Blocked users'/>
		<Cont  padding='0px' width='95%' height='40px' borderBottom='1px solid white'>
			<Option text='Confidentiality'/>
		</Cont>
		<ButtonOption image={password_svg} text='Change password'/>
		<ButtonOption image={lock_svg} text='2FA authentication'/>
		</React.Fragment>
	);
}

const Option = ({text}: Props) => {
	return (
		<div style={{ marginTop: '-28px' }}>
    		<p className='text big bold purple-stroke'>{text}</p>
		</div>
	);
}

const ButtonOption = ({ image, text }: Props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [hovered, setHovered] = React.useState(false);

  const handleTextClick = () => {
		setShowOptions(true);
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
        alignItems: 'center',
        padding: '5px',
        gap: '10px',
        width: '175px',
        height: '42px',
        alignSelf: 'auto',
		backgroundColor: buttonColor
      }}
	  onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
	  onClick={handleTextClick}
    >
      <img src={image} />
      <p className='text bold'>{text}</p>
      {showOptions && <div className='text'>Options</div>}
    </button>
  );
};


function Settings() {
    return (
        <div className="Home">
			<Cont width='50%' height='30%' direction='column' borderRadius='15px' backgroundColor='rgba(0, 0, 0, 0.75)' minWidth='679px' minHeight='425px'>
				<HeaderBar borderBottom='1px solid #ffffff'>
					<SettingsTitle /> <ReturnButton />
				</HeaderBar>
				<Cont backgroundColor='none' width='100%' direction='row'>
					<Cont backgroundColor='none' borderRight='1px solid #ffffff' width='220px' height='94%' borderRadius='15px' >
						<SettingsOptions/>
					</Cont>
					<Cont backgroundColor='none' minWidth='270px' minHeight='340px' width='100%' height='98%'>

					</Cont>
				</Cont>
			</Cont>
        </div>
    );
}

export default Settings;
