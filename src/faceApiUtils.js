import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  const MODEL_URL = '/models';
  try {
    // Load models sequentially
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log('Models loaded successfully!');
  } catch (error) {
    console.error('Error loading models:', error);
  }
};

export const detectFace = async (imageSrc) => {
    try {
      const image = await createImage(imageSrc);
      const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
                                      .withFaceLandmarks();
      if (!detection) {
        console.warn('No face detected');
        return null;
      }
      return detection.detection.box;
    } catch (error) {
      console.error('Error detecting face:', error);
      return null;
    }
  };

  export const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous'; // Avoid CORS issues
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });

