import './App.css';
import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { removeBackground } from "@imgly/background-removal";
import scaleImage from './ScaleImage';
import CropImage from './CropImage';

function App() {
  const [processedImage, setProcessedImage] = useState(null); // For background removal
  const [scaledImage, setScaledImage] = useState(null); // For image scaling

  const handleImageUploadForProcessing = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const blob = await removeBackground(file);
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    }
  };

  const handleImageUploadForScaling = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = async () => {
        // Scale the image to a maximum of 300x300 pixels
        const scaledBlob = await scaleImage(image, 300, 300);
        const url = URL.createObjectURL(scaledBlob);
        setScaledImage(url);
      };
    }
  };

  return (
    <div className="App">
      {/* Background Removal */}
      <div>
        <h3>Remove Background</h3>
        <ImageUpload onImageUpload={handleImageUploadForProcessing} />
        {processedImage && <img src={processedImage} alt="Processed" />}
      </div>

      {/* Image Scaling */}
      <div>
        <h3>Scale Image</h3>
        <input type="file" accept="image/*" onChange={handleImageUploadForScaling} />
        {scaledImage && <img src={scaledImage} alt="Scaled" />}
      </div>

      {/* Image Cropping */}
      <div>
        <h3>Crop Image</h3>
        <CropImage />
      </div>
    </div>
  );
}

export default App;
