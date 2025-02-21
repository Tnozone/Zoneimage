import express from 'express';
import { getDb } from '../lib/mongodb.js';
import { deleteImage } from '../lib/deleteImg.js';

const router = express.Router();

router.post('/verify-user', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await getDb();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        res.json({ success: true, userId: user._id.toString() });

    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.delete('/delete-user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = await getDb();

        // Find the user by ID
        const user = await db.collection('users').findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find all images associated with the user
        const images = await db.collection('savedImages')
            .find({ userId: id })
            .toArray();

        // Delete each image from the storage and database
        for (const image of images) {
            await deleteImage(image.imageUrl);
        }

        // Delete the user's images from the database
        await db.collection('savedImages').deleteMany({ userId: id });

        // Delete the user from the database
        const deleteResult = await db.collection('users').deleteOne({ _id: id });

        if (deleteResult.deletedCount === 0) {
            return res.status(500).json({ message: "Failed to delete user" });
        }

        res.json({ message: "User and all associated images deleted successfully" });

    } catch (error) {
        console.error("Error deleting user and images:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;