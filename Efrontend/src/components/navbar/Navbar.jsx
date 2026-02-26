import React, { useState } from 'react'
import { useRef } from 'react'
import './Navbar.css'
import logo from '../assets/logo.webp'
import cart from '../assets/cart_icon.png'
import { Link } from 'react-router'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();
    const dropdownRef = useRef();

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        dropdownRef.current.classList.toggle('open');
    }

    const handleMenuClick = (menuName) => {
        setMenu(menuName);
        // Close mobile menu after selecting
        if (window.innerWidth <= 768) {
            menuRef.current.classList.remove('nav-menu-visible');
            dropdownRef.current.classList.remove('open');
        }
    }

    return (
        <div className='navbar'>
            <Link to="/" className='nav-logo' onClick={() => handleMenuClick('shop')}>
                <img src={logo} alt='Dayviih Shop Logo' />
                <p>DAYVIIH SHOP</p>
            </Link>

            <div className='nav-dropdown' ref={dropdownRef} onClick={dropdown_toggle}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul ref={menuRef} className='nav-menu'>
                <li onClick={() => handleMenuClick("shop")}>
                    <Link to={"/"}>Shop</Link>
                    {menu === "shop" ? <hr /> : <></>}
                </li>
                <li onClick={() => handleMenuClick("mens")}>
                    <Link to={"/mens"}>Men</Link>
                    {menu === "mens" ? <hr /> : <></>}
                </li>
                <li onClick={() => handleMenuClick("womens")}>
                    <Link to={"/womens"}>Women</Link>
                    {menu === "womens" ? <hr /> : <></>}
                </li>
                <li onClick={() => handleMenuClick("kids")}>
                    <Link to={"/kids"}>Kids</Link>
                    {menu === "kids" ? <hr /> : <></>}
                </li>
            </ul>

            <div className='nav-login-cart'>
                <Link to={"/login"}><button>Login</button></Link>
                <Link to={"/cart"} style={{ position: 'relative' }}>
                    <img src={cart} alt='Shopping Cart' />
                    {getTotalCartItems() > 0 && <div className='nav-cart-count'>{getTotalCartItems()}</div>}
                </Link>
            </div>
        </div>
    )
}

export default Navbar