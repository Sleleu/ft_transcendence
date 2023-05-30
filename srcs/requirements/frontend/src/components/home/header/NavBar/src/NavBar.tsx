import React, { FC } from 'react'
import '../css/NavBar.css'
import { User } from '../../../../types';

interface NavBarProps {
	user: User
    changeComponent: (component: string) => void;
    front: () => void;
	handleLogout: () => void;
}

const NavBar: FC<NavBarProps> = ({user, changeComponent, front, handleLogout }) => {
  return (
    <div className='containerNavBar'>
        <div
        onClick={() => front()} 
        className='returnLogo'
        />   
        <div
        onClick={() => changeComponent("menue")} 
        className='menueLogo'
        />
         <div
        onClick={handleLogout} 
        className='logoutLogo'
        />
        <div
        onClick={() => changeComponent("stat")}
		style={{backgroundImage: `url(${user.avatar})`}}
        className='avatar'
        />
    </div>
  )
}

export default NavBar