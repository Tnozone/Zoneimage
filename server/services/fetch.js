import { getDb } from '../lib/mongodb.js';
import { bucket } from '../lib/googleCloudStorage.js';

/**
 * Fetches the public URLs of saved images for a specific user.
 *
 * @param {string} userId - The ID of the user whose images are being fetched.
 * @returns {array} An array of public URLs of the user's saved images.
 */
export async function fetchUserImages(userId) {
    if (!userId) {
        throw new Error('User ID is required to fetch images');
    }

    try {
        // Get MongoDB connection
        const db = await getDb();
        const savedImages = db.collection('savedImages');

        // Query the database for images associated with the user
        const images = await savedImages.find({ userId }).toArray();

        if (images.length === 0) {
            return [];
        }

        // Check if the images exist in Google Cloud Storage and generate URLs
        const imageUrls = await Promise.all(
            images.map(async (image) => {
                const file = bucket.file(image.imageUrl.replace(`https://storage.googleapis.com/${bucket.name}/`, ''));

                // Confirm the file exists in the bucket
                const [exists] = await file.exists();
                if (!exists) {
                    console.warn(`Image not found in storage: ${image.imageUrl}`);
                    return null;
                }

                return image.imageUrl;
            })
        );

        // Filter out any null values (for images that were missing in the bucket)
        return imageUrls.filter((url) => url !== null);
    } catch (error) {
        console.error(`[Error] Failed to fetch images for user ${userId}. Details:`, {
            message: error.message,
            stack: error.stack,
        });
        throw new Error('Failed to fetch user images');
    }
}