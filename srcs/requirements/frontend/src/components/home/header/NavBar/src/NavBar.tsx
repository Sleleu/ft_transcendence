import React, { FC } from 'react'
import '../css/NavBar.css'

interface NavBarProps {
    changeComponent: (component: string) => void;
    oldComponent: string;
}

const NavBar: FC<NavBarProps> = ({changeComponent, oldComponent}) => {
  return (
    <div className='containerNavBar'>
        <div
        onClick={() => changeComponent(oldComponent)} 
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