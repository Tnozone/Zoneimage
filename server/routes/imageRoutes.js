import express from 'express';
import { saveImage } from '../services/savedImages.js';
import { authenticate } from '../middleware/authenticate.js';
import { getDb } from '../lib/mongodb.js';

const router = express.Router();

router.use(authenticate);

router.post('/save', async (req, res) => {
  const { imageUrl } = req.body;

  // Assuming `req.user.id` is populated by middleware (e.g., from a JWT token or session)
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

router.get('/images', async (req, res) => {
  console.log('Handling GET /api/images');

  // Assuming `req.user.id` is populated by authentication middleware
  const userId = req.user?.id;

  if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID is required' });
  }

  try {
      // Get MongoDB connection and query the images collection
      const db = await getDb();
      const savedImages = db.collection('savedImages');

      // Find images where `userId` matches the logged-in user
      const images = await savedImages.find({ userId }).toArray();

      // Extract public URLs from the images
      const imageUrls = images.map(image => image.imageUrl);

      console.log("Fetched images for user:", userId, imageUrls);

      res.status(200).json({ images: imageUrls });
  } catch (error) {
      console.error(`[Error] Failed to fetch images for user ${userId}. Details:`, {
          message: error.message,
          stack: error.stack,
      });
      res.status(500).json({ message: 'Failed to fetch images', error: error.message });
  }
});

export default router;