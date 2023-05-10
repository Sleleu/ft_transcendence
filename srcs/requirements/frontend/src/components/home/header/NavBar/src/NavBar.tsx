import React, { FC } from 'react'
import '../css/NavBar.css'

interface NavBarProps {
    changeComponent: (component: string) => void;
    front: () => void;
}

const NavBar: FC<NavBarProps> = ({changeComponent, front}) => {
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
        onClick={() => changeComponent("login")} 
        className='logoutLogo'
        />
        <div
        onClick={() => changeComponent("stat")} 
        className='avatar'
        />
    </div>
  )
}

export default NavBar