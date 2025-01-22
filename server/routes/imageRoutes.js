import { Storage } from '@google-cloud/storage';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/mongodb.js';

const router = express.Router();

// Instantiate Google Cloud Storage
const storage = new Storage({
    keyFilename: './cloudkey.json',
});
const bucketName = 'zoneimages_saved';
const bucket = storage.bucket(bucketName);

router.post('/save', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL (base64) is required' });
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
      const result = await savedImages.insertOne({ imageUrl: publicUrl, createdAt: new Date() });
  
      res.status(201).send({ message: 'Image saved successfully', imageId: result.insertedId, publicUrl });
    } catch (error) {
      console.error(`[Error] Failed to save image. Details:`, {
        message: error.message,
        stack: error.stack,
        bucketError: error.bucketError || null,
      });
      res.status(500).json({ message: 'Failed to save image', error: error.message });
    }
});

router.get('/images', async (req, res) => {
    console.log('Handling GET /api/images');

    try {
        // Get the list of files in the bucket
        const [files] = await storage.bucket(bucketName).getFiles();

        // Map the file names to their public URLs
        const imageUrls = files.map(file => {
            return `https://storage.googleapis.com/${bucketName}/${file.name}`;
        });
        console.log("Fetched images:", imageUrls);

        res.status(200).json({ images: imageUrls });
    } catch (error) {
        console.error(`[Error] Failed to fetch images from bucket. Details:`, {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Failed to fetch images', error: error.message });
    }
});

export default router;