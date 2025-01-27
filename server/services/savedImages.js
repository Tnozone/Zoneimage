import { bucket } from '../lib/googleCloudStorage.js';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/mongodb.js';
import sharp from 'sharp';

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
        // Remove base64 prefix if it exists
        const base64Image = imageUrl.replace(/^data:image\/\w+;base64,/, '');

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Image, 'base64');

        // Use sharp to detect image format
        const image = sharp(buffer);
        const metadata = await image.metadata();

        // Generate a unique filename with the correct extension
        const extension = metadata.format;
        const filename = `images/${uuidv4()}.${extension}`;

        // Upload the image to the bucket
        const file = bucket.file(filename);
        await file.save(buffer, {
            metadata: { contentType: 'image/${extension}' },
        });

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

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