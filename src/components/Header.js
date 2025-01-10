import React from 'react';
import './Header.css';
import logo from '../assets/Zoneimages-logo.png';

const Header = () => {
    return (
      <header>
        <div class="logo-container">
          <a to="/"><img src={logo} alt="Logo" /></a>
        </div>
        <div class="login-link">
          <a href="/Login">LOG IN</a>
        </div>
      </header>
    );
};

export default Header;