
import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/Zoneimages-logo.png';

const Login = () => {
    return (
            <main>
                <div className="login-container">
                    <div className="login-card">
                        <div className="brand-logo">
                            <img src={logo} alt="Logo" />
                        </div>
                        <h2>Welcome Back</h2>
                        <form action="/login" method="post">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                placeholder="Enter your email" 
                            />
                            
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                required 
                                placeholder="Enter your password" 
                            />
                            
                            <div className="form-options">
                                <label>
                                    <input type="checkbox" name="remember-me" /> Remember Me
                                </label>
                                <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                            </div>
                            
                            <button type="submit" className="login-button">Log In</button>
                        </form>
                        <p className="signup-text">Don't have an account? <a href="/Registry">Sign up</a></p>
                    </div>
                </div>
            </main>
    )
};

export default Login;