import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/logo.webp'
import navProfile  from '../../assets/profile1.jpg'

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navlogo">
        <img src={navlogo} alt="" className="nav-logo" />
        <p>DAYVIIH SHOP</p>
        </div>
        <img src={navProfile} className='nav-profile' alt="" />
    </div>
  )
}

export default Navbar