import React from 'react';
import './Settings.css'
import '../../assets/css/Text.css'
import settings_svg from '../../assets/img/settings.svg';
import return_svg from '../../assets/img/return.svg';
import frog_svg from '../../assets/img/frog.svg';

function Home() {
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
        </div>
    );
}

export default Home;
