import {Cont} from '../container/container'

const SettingsUsername = () => {
	return (
		<>
			<p className='text bold'>Your current username :</p>
			<p className='text bold'>If you want to change, please enter a new username :</p>
		</>
	);
}

const SettingsAvatar = () => {
	return (
		<>
			<p className='text bold'>Current username :</p>
			<button className='text bold'>Change Avatar</button>
		</>
	);
}

const SettingsBlock = () => {
	return (
		<>
			<p className='text bold'>This is a list of blocked users :</p>
		</>
	);
}

const SettingsPassword = () => {
	return (
		<>
			<p className='text bold'>Change password</p>
		</>
	);
}

const SettingsLock = () => {
	return (
		<Cont minWidth='427px' minHeight='340px' width='427px' height='340px'> 
			<p className='text bold'>2F authentication</p>
		</Cont>
	); // on garde le cont ici au cas ou
}

export {SettingsUsername,
		SettingsAvatar,
		SettingsBlock,
		SettingsPassword,
		SettingsLock};