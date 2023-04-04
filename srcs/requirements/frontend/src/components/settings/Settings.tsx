import React, { CSSProperties, Component } from 'react';
import './Settings.css'
import '../../assets/css/Text.css'
import { useNavigate } from 'react-router-dom';

import settings_svg from '../../assets/img/settings.svg';
import return_svg from '../../assets/img/return.svg';
import frog_svg from '../../assets/img/frog.svg';
import {Cont, HeaderBar} from '../container/container'

type Props = {
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
		<button className='btn-return' onClick={() => navigate("/")}>
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
		<Cont  padding='0px' width='95%' height='40px' borderBottom='1px solid white'>
			<Option text='Confidentiality'/>
		</Cont>
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

const ButtonOption = () => {
	return (
		<React.Fragment>
			
		</React.Fragment>
	);
}

function Settings() {
    return (
        <div className="Home">
			<div className="settings">
				
				<div className='header-bar'>
					<div className='display-settings'>
						<div className='symbol'>
							<img src={settings_svg} className='vector-neon'/>
						</div>
							<p className='text big bold cyan-stroke'>Settings</p>
					</div>
					<button className='btn-return'>
						<img src={return_svg} className='vector-neon-return'/>
					</button>
				</div>
			
				<div className='settings-container'>
					<div className='display-settings'>
						<div className='profile'>
							<div className='profile-header'>
								<p className='text big bold purple-stroke'>Profile</p>
							</div>
							<div className='avatar'>
								<img src={frog_svg} className='vector-neon'/>
								<h3 className='text'>Avatar</h3>
							</div>
							<div className='profile-header'>
								<p className='text big bold purple-stroke'>Confidentiality</p>
							</div>
						</div>
					</div>
					<div className='select-settings'>

					</div>
				</div>
			</div>
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
