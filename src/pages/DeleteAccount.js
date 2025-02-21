import './DeleteAccount.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Zoneimages-logo.png';

const DeleteAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            // Step 1: Verify user credentials
            const verifyResponse = await axios.post('http://localhost:5000/api/users/verify-user', { email, password });
    
            if (verifyResponse.data.success) {
                const userId = verifyResponse.data.userId; // Get userId from the response
    
                // Step 2: Call the delete route
                await axios.delete(`http://localhost:5000/api/users/delete-user/${userId}`);
    
                setMessage('Your account has been deleted.');
                localStorage.removeItem('userId'); // Clear user data
                navigate('/login'); // Redirect to login page
            } else {
                setMessage('Invalid email or password. Please try again.');
            }
        } catch (error) {
            setMessage('Error deleting account. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    return (
        <main>
            <div className="delete-account-container">
                <div className="delete-account-card">
                    <div className="brand-logo">
                        <img src={logo} alt="Logo" />
                    </div>
                    <h2>Delete Your Account</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {!showConfirm ? (
                            <button
                            type="submit"
                            className="delete-account-button"
                        >
                            Delete Account
                            </button>
                        ) : (
                            <>
                                <p className="confirmation-message">
                                    Are you sure you want to delete your account? This action cannot be undone.
                                </p>
                                <button
                                    type="button"
                                    className="delete-account-button"
                                    onClick={handleDelete}
                                >
                                    Yes, Delete Account
                                </button>
                                <a href="#" className="cancel-link" onClick={() => setShowConfirm(false)}>
                                    Cancel
                                </a>
                            </>
                        )}

                        {message && <p>{message}</p>}
                    </form>
                </div>
                </div>
        </main>
    );
};

export default DeleteAccount;
