import React, { useState } from 'react';
import axios from 'axios';
import './Registry.css';
import logo from '../assets/Zoneimages-logo.png';

function Registry() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post('/api/auth/register', { name, email, password });
        setMessage(response.data.message);
        } catch (error) {
        setMessage(error.response.data.message || 'An error occurred.');
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
                        <label for="username">Name</label>
                        <input type="text" id="username" name="username" required placeholder="Enter your username" value={name} onChange={(e) => setName(e.target.value)} />
                        
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        
                        <label for="confirm-password">Confirm Password</label>
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