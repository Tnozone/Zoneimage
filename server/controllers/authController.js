import { registerUser, loginUser } from '../services/auth.js';

// Controller function to handle user registration
export const register = async (req, res) => {
  // Extract user details from the request body
  const { name, email, password } = req.body;
  try {
    // Call the registerUser function to create a new user and return the user ID
    const userId = await registerUser(name, email, password);
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller function to handle user login
export const login = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;
  try {
    // Call the loginUser function to authenticate the user and retrieve authentication details
    const { token, userId, username } = await loginUser(email, password);
    res.status(200).json({ token, userId, username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};