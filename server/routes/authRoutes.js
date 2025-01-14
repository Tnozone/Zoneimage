import express from 'express';
import { registerUser, loginUser } from '../services/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userId = await registerUser(name, email, password);
        res.status(201).send({ userId });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, userId } = await loginUser(email, password);
        res.status(200).send({ token, userId });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;