const SettingsAvatar = () => {
	return (
		<>
			<p className='text bold'>Current username :</p>
			<button className='btn-little text bold medium cyan-stroke'>Change Avatar</button>
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

const SettingsLock = () => {
	return (
		<>
			<p className='text bold'>2F authentication</p>
		</>
	);
}

export {SettingsAvatar,
		SettingsBlock,
		SettingsLock};