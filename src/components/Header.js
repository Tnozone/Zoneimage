import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../assets/Zoneimages-logo.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="logo-container">
        <a href="/"><img src={logo} alt="Logo" /></a>
      </div>
      {isLoggedIn ? (
        <nav>
          <div className="hamburger" onClick={toggleMenu}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <ul className={menuOpen ? 'show' : ''}>
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