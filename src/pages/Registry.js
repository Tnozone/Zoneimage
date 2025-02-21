import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registry.css';
import logo from '../assets/Zoneimages-logo.png';

function Registry() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            await axios.post('/api/auth/register', { name, email, password });
            setMessage('Registration successful! Please log in.');
            navigate('/Login');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'An error occurred.';
            setMessage(errorMsg);
        }
    };

    return (
        <main>
            <div className="signup-container">
                <div className="signup-card">
                    <div className="brand-logo">
                        <img src={logo} alt="Brand Logo" />
                    </div>
                    <h2>Create Your Account</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Name</label>
                        <input type="text" id="username" name="username" required placeholder="Enter your username" value={name} onChange={(e) => setName(e.target.value)} />
                        
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" name="confirm-password" required placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        
                        <button type="submit" class="signup-button">Register</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                    <p className="login-text">Already have an account? <a href="/Login">Log in</a></p>
                </div>
            </div>
        </main>
    )
};

export default Registry;