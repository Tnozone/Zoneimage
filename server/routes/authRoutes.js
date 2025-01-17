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
        const { token, userId, username } = await loginUser(email, password);
        res.status(200).send({ token, userId, username });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.send({ message: 'Logout successful' });
    });
});

router.post('/save', async (req, res) => {
    const { imageUrl } = req.body;
    const db = await getDb();
    const savedImages = db.collection('savedImages');

    try {
        const result = await savedImages.insertOne({ imageUrl, createdAt: new Date() });
        res.status(201).send({ message: 'Image saved successfully', imageId: result.insertedId });
    } catch (error) {
        res.status(500).send({ message: 'Failed to save image', error });
    }
});

export default router;