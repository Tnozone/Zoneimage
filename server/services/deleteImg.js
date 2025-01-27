import { bucket } from '../lib/googleCloudStorage.js';
import { getDb } from '../lib/mongodb.js';

// Function to delete the image from both Cloud Storage and database
export const deleteImage = async (imageUrl) => {
    try {
        // Ensure imageUrl is valid and extract the image name
        if (!imageUrl) {
            throw new Error('No image URL provided.');
        }

        // Extract the image name from the imageUrl
        const imageName = imageUrl.split('/').pop();
        
        if (!imageName) {
            throw new Error('Could not extract image name from URL.');
        }

        console.log('Deleting image:', imageName);

        // Add the folder path to the image name
        const imagePath = `images/${imageName}`; // Adjust this to match your bucket structure
        console.log('Deleting image from path:', imagePath);

        // Delete the file from the bucket
        await bucket.file(imagePath).delete();
        console.log(`Image ${imagePath} deleted successfully from cloud storage.`);

        // Delete the image reference from the database
        const db = await getDb();
        const savedImages = db.collection('savedImages');
        const result = await savedImages.deleteOne({ imageUrl });

        // Check if the image was successfully deleted from the database
        if (result.deletedCount === 0) {
            throw new Error('Image not found in the database');
        }

        return { success: true, message: 'Image deleted successfully!' };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, message: error.message || 'An error occurred while deleting the image.' };
    }
};