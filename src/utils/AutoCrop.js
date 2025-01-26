import * as faceapi from 'face-api.js';

// Function to crop a portrait by centering on the face
export const autoCrop = async (imageSrc) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Load the image
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Prevents CORS issues
      img.src = imageSrc;

      img.onload = async () => {
        console.log('Image loaded for auto-crop...');
        try {
          // Create a canvas to draw the cropped image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const originalWidth = img.width;
          const originalHeight = img.height;
          canvas.width = originalWidth;
          canvas.height = originalHeight;

          // Load face-api models (ensure these are downloaded and available)
          await faceapi.nets.tinyFaceDetector.loadFromUri('/models'); // Use tinyFaceDetector model
          await faceapi.nets.faceRecognitionNet.loadFromUri('/models'); // Use faceRecognitionNet model
          await faceapi.nets.faceLandmark68Net.loadFromUri('/models'); // Load the FaceLandmark68Net model

          // Detect the face and landmarks
          const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
          if (!detections) {
            console.warn('No face detected.');
            resolve(imageSrc); // Return the original image if no face is detected
            return;
          }

          // Get face bounding box
          const { x, y, width, height } = detections.detection.box;

          // Adjust the crop area to ensure the head occupies 65-75% of the height
          const desiredHeadRatio = 0.5; // Midpoint of 65-75%
          const newHeight = height / desiredHeadRatio; // Calculate new height for the image
          const newWidth = newHeight * (originalWidth / originalHeight); // Maintain aspect ratio

          // Center the crop area on the face
          const cropX = Math.max(0, x + width / 2 - newWidth / 2);
          const cropY = Math.max(0, y + height / 2 - newHeight / 2 - height * 0.15); // Adjust by 10% of face height

          // Ensure the crop area doesn't exceed the image bounds
          const cropWidth = Math.min(newWidth, originalWidth - cropX);
          const cropHeight = Math.min(newHeight, originalHeight - cropY);

          // Create a new canvas for the cropped image with the correct size
          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = cropWidth;
          cropCanvas.height = cropHeight;
          const cropCtx = cropCanvas.getContext('2d');

          // Perform the crop by drawing the portion of the image onto the new canvas
          cropCtx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

          // Return the cropped image as a data URL
          resolve(cropCanvas.toDataURL('image/jpeg'));
        } catch (error) {
          console.error('Auto-crop error:', error);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(error);
      };
    } catch (error) {
      console.error('Error during auto-crop:', error);
      reject(error);
    }
  });
};