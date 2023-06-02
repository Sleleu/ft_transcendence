import React, { FC } from 'react'
import '../css/NavBar.css'

interface NavBarProps {
  changeComponent: (component: string) => void;
  front: () => void;
  handleLogout: () => void;
}

const NavBar: FC<NavBarProps> = ({ changeComponent, front, handleLogout }) => {
  return (
    <div className='containerNavBar'>
      <div
        onClick={() => front()}
        className='returnLogo'
        title='return'
      />
      <div
        onClick={() => changeComponent("menue")}
        className='menueLogo'
        title='menue'
      />
      <div
        onClick={handleLogout}
        className='logoutLogo'
        title='log out'
      />
      <div
        onClick={() => changeComponent("stat")}
        className='avatar'
        title='stat'
      />
    </div>
  )
}

export default NavBar