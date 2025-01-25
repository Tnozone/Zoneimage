import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { Storage } from '@google-cloud/storage';
import { getDb } from '../lib/mongodb.js';

// Initialize Google Cloud Storage
const storage = new Storage({
    keyFilename: './cloudkey.json', // Path to your Google Cloud service account key
});
const bucketName = 'zoneimages_saved';
const bucket = storage.bucket(bucketName);

export const deleteUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Connect to MongoDB and query user's images
        const db = await getDb();
        const savedImages = db.collection('savedImages');

        // Find all images belonging to the user
        const userImages = await savedImages.find({ userId: user._id.toString() }).toArray();

        // Delete each image from the storage bucket
        const deletePromises = userImages.map(async (image) => {
            const fileName = image.imageUrl.split(`${bucketName}/`)[1]; // Extract the file name
            const file = bucket.file(fileName);

            try {
                await file.delete(); // Delete the file from the bucket
                console.log(`Deleted file: ${fileName}`);
            } catch (err) {
                console.error(`Failed to delete file ${fileName}:`, err.message);
            }
        });

        // Wait for all delete operations to complete
        await Promise.all(deletePromises);

        // Remove user's images from the database
        await savedImages.deleteMany({ userId: user._id.toString() });

        // Delete the user from the database
        await User.findOneAndDelete({ email });

        res.status(200).json({ message: 'User and their images deleted successfully' });
    } catch (error) {
        console.error('[Error] Failed to delete user and images:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};