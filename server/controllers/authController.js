import { registerUser, loginUser } from '../services/auth.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userId = await registerUser(name, email, password);
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, userId, username } = await loginUser(email, password);
    res.status(200).json({ token, userId, username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};