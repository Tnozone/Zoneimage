import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/mongodb.js';

const storage = new Storage({
    keyFilename: './cloudkey.json',
});
const bucketName = 'zoneimages_saved';
const bucket = storage.bucket(bucketName);

/**
 * Saves an image to Google Cloud Storage and stores its reference in MongoDB.
 *
 * @param {string} imageUrl - The image in base64 format.
 * @param {string} userId - The ID of the logged-in user.
 * @returns {object} The result containing the public URL and MongoDB document ID.
 */
export async function saveImage(imageUrl, userId) {
    if (!imageUrl || !userId) {
        throw new Error('Image URL and User ID are required');
    }

    try {
        // Generate a unique file name
        const filename = `images/${uuidv4()}.jpg`;

        // Upload the image to the bucket
        const file = bucket.file(filename);
        const buffer = Buffer.from(imageUrl, 'base64');
        await file.save(buffer, {
            metadata: { contentType: 'image/jpeg' },
        });

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

        // Save the public URL to the database
        const db = await getDb();
        const savedImages = db.collection('savedImages');
        const result = await savedImages.insertOne({
            userId,
            imageUrl: publicUrl,
            createdAt: new Date(),
        });

        return { publicUrl, imageId: result.insertedId };
    } catch (error) {
        console.error(`[Error] Failed to save image. Details:`, {
            message: error.message,
            stack: error.stack,
        });
        throw new Error('Failed to save image');
    }
}