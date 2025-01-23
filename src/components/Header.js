import React, { useState, useEffect } from 'react';
import './Header.css';
import '../App.css';
import logo from '../assets/Zoneimages-logo.png';
import eyeBlack from '../assets/eye-icon-black.png';
import eyeWhite from '../assets/eye-icon-white.png';
import { toggleTheme, loadSavedTheme } from '../utils/darkMode.js';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [currentImage, setCurrentImage] = useState(eyeBlack);

  const checkLoginState = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  useEffect(() => {
    // Check login state on component mount
    checkLoginState();

    // Optional: Listen to localStorage changes to update login state
    window.addEventListener('storage', checkLoginState);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('storage', checkLoginState);
    };
  }, []);

  const handleLogout = () => {
    // Clear the token and username from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Set the state to log the user out
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleToggle = () => {
    toggleTheme();
    setCurrentImage((prevImage) => (prevImage === eyeBlack ? eyeWhite : eyeBlack)); // Switch image
  };

  useEffect(() => {
    loadSavedTheme();
  }, []);

  return (
    <header>
      <div className='user-toggles'>
        <img src={currentImage} alt="theme-toggle icon" id="theme-toggle" onClick={handleToggle} />
      </div>
      <div className="logo-container">
        <a href="/"><img src={logo} alt="Logo" /></a>
      </div>
      {isLoggedIn ? (
        <nav>
          <label className='hamburger-menu'>
            <input type="checkbox"></input>
          </label>
          <ul className='nav-items'>
            <li>Welcome, {username}</li>
            <li><a href="/Editor">Edit</a></li>
            <li><a href="/Gallery">Gallery</a></li>
            <li>
              <a href="#" onClick={() => handleLogout(setIsLoggedIn, setUsername)}>Logout</a>
            </li>
            <li><a href="/DeleteAccount">Unsubscribe</a></li>
          </ul>
        </nav>
      ) : (
        <div className="login-link">
          <a href="/Editor">Edit</a>
          <a href="/Login">LOG IN</a>
          <a href="/Registry">Register</a>
        </div>
      )}
    </header>
  );
};

export default Header;