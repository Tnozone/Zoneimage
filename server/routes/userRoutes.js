import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { deleteUser } from '../controllers/userController.js';

const router = express.Router();

async function authenticateUser(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}
  
router.delete('/users/:id', authenticateUser, async (req, res) => {
    if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: 'You can only delete your own account' });
    }
    await deleteUser(req, res);
});

export default router;