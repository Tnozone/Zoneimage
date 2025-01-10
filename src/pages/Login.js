
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from '../assets/Zoneimages-logo.png';

function Login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', 
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setMessage('Login successful');
            // Handle successful login (e.g., store token, redirect)
            localStorage.setItem('token', response.data.token);
            // Redirect to the homepage
            navigate('/');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred.');
        }
    };

    return (
            <main>
                <div className="login-container">
                    <div className="login-card">
                        <div className="brand-logo">
                            <img src={logo} alt="Logo" />
                        </div>
                        <h2>Welcome Back</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                placeholder="Enter your email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                required 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            
                            <div className="form-options">
                                <label>
                                    <input type="checkbox" name="remember-me" /> Remember Me
                                </label>
                                <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                            </div>
                            
                            <button type="submit" className="login-button">Log In</button>
                            {message && <p>{message}</p>}
                        </form>
                        <p className="signup-text">Don't have an account? <a href="/Registry">Sign up</a></p>
                    </div>
                </div>
            </main>
    )
};

export default Login;