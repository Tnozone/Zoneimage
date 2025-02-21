import bcrypt from 'bcrypt';
import { bucket } from '../lib/googleCloudStorage.js';
import { getDb } from '../lib/mongodb.js';

export const deleteUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Attempting to delete user with email:", email);

    try {
        // Find the user by email
        const db = await getDb();
        const savedImages = db.collection('savedImages');

        // Find user by email
        const user = await db.collection('users').findOne({ email });

        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
        }

        // Find all images belonging to the user
        const userImages = await savedImages.find({ userId: user._id.toString() }).toArray();

        // Delete each image from the storage bucket
        const deletePromises = userImages.map(async (image) => {
        try {
            const fileName = image.imageUrl.split(`${bucketName}/`)[1];
            if (fileName) {
            const file = bucket.file(fileName);
            await file.delete();
            console.log(`Deleted file: ${fileName}`);
            } else {
            console.warn(`Invalid image URL: ${image.imageUrl}`);
            }
        } catch (err) {
            console.error(`Failed to delete image: ${image.imageUrl}`, err);
        }
        });

        // Wait for all delete operations to complete
        await Promise.all(deletePromises);

        // Remove user's images from the database
        await savedImages.deleteMany({ userId: user._id.toString() });

        // Delete the user from the database
        await db.collection('users').deleteOne({ _id: user._id });

        res.status(200).json({ message: 'User and their images deleted successfully' });
    } catch (error) {
        console.error('[Error] Failed to delete user and images:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};