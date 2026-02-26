import React from 'react'
import './Footer.css'
import footer_logo from '../assets/logo.webp'
import instagram_icon from '../assets/instagram_icon.png'
import pintester_icon from '../assets/pintester_icon.png'
import whatsapp_icon from '../assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
      
      <div className="footer-logo">
        <img src={footer_logo} alt="Logo" />
        <p>DAYVIIH SHOP</p>
      </div>

      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="footer-social-icon">

        {/* Instagram */}
        <div className="footer-icons-container">
          <a 
            href="https://www.instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagram_icon} alt="Instagram" />
          </a>
        </div>

        {/* Pinterest */}
        <div className="footer-icons-container">
          <a 
            href="https://www.pinterest.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={pintester_icon} alt="Pinterest" />
          </a>
        </div>

        {/* WhatsApp */}
        <div className="footer-icons-container">
          <a 
            href="https://wa.me/254115149719?text=Hello%20I%20am%20interested%20in%20your%20products"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={whatsapp_icon} alt="WhatsApp" />
          </a>
        </div>

      </div>

      <div className="footer-copyright">
        <hr />
        <p>Copyright © 2025 - All rights reserved</p>
      </div>

    </div>
  )
}

export default Footer