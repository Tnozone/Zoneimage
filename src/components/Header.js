import React from 'react';
import './Header.css';
import logo from '../assets/Zoneimages-logo.png';

const Header = () => {
    return (
        <header>
      <div class="logo-container">
        <a href="/"><img src={logo} alt="Logo" /></a>
      </div>
      <div class="login-link">
        <a href="/login">LOG IN</a>
      </div>
    </header>
    );
};

export default Header;