import express from 'express';
import { saveImage } from '../services/savedImages.js';
import { fetchUserImages } from '../services/fetch.js';
import { deleteImage } from '../services/deleteImg.js';
import { authenticate } from '../middleware/authenticate.js';
import { Storage } from '@google-cloud/storage';


const router = express.Router();

const storage = new Storage({
    keyFilename: './cloudkey.json',
});
const bucketName = 'zoneimages_saved';
const bucket = storage.bucket(bucketName);

router.use(authenticate);

//save the image to storage
router.post('/save', async (req, res) => {
  const { imageUrl } = req.body;

  const userId = req.user?.id;

  if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID is required' });
  }

  if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL (base64) is required' });
  }

  try {
      // Call the service to handle the image saving
      const { publicUrl, imageId } = await saveImage(imageUrl, userId);

      res.status(201).send({
          message: 'Image saved successfully',
          imageId,
          publicUrl,
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

//fetch image to display in the gallery
router.get('/', async (req, res) => {
    console.log('Handling GET /api/images');

    const userId = req.user?.id;
    console.log('User ID:', userId);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID is required' });
    }

    try {
        const imageUrls = await fetchUserImages(userId);
        console.log('Fetched image URLs:', imageUrls);

        res.status(200).json({ images: imageUrls });
    } catch (error) {
        console.error(`Failed to fetch images: ${error.message}`);
        res.status(500).json({ message: 'Failed to fetch images', error: error.message });
    }
});

// DELETE request to remove image
router.delete('/delete', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'Image URL is required' });
        }

        // Call the deleteImage service to handle the deletion
        const result = await deleteImage(imageUrl);

        if (result.success) {
            return res.status(200).json({ success: true, message: result.message });
        } else {
            return res.status(500).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error in delete route:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

export default router;