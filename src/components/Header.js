import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../assets/Zoneimages-logo.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear the token and username from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Set the state to log the user out
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <header>
      <div className="logo-container">
        <a href="/"><img src={logo} alt="Logo" /></a>
      </div>
      {isLoggedIn ? (
        <nav>
          <ul>
            <li>Welcome, {username}</li>
            <li><a href="/Gallery">Gallery</a></li>
            <li>
              <a href="#" onClick={() => handleLogout(setIsLoggedIn, setUsername)}>Logout</a>
            </li>
          </ul>
        </nav>
      ) : (
        <div className="login-link">
          <a href="/Login">LOG IN</a>
          <a href="/Registry">Register</a>
        </div>
      )}
    </header>
  );
};

export default Header;