import axios from 'axios';

export const deleteImage = async (imageUrl, token, setImages) => {
    try {
        // Log imageUrl to ensure it's correct
        console.log('Attempting to delete image:', imageUrl);
        
        // Send a DELETE request with the image URL and token
        const response = await axios.delete('http://localhost:5000/api/images/delete', {
            data: { imageUrl },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Check if the response was successful
        if (response.data.success) {
            // Update the gallery state to remove the deleted image
            setImages((prevImages) => prevImages.filter((image) => image !== imageUrl));
            return { success: true, message: 'Image deleted successfully!' };
        } else {
            return { success: false, message: response.data.message || 'Failed to delete image from backend' };
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, message: 'Failed to delete the image.' };
    }
};