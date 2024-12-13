import './App.css';
import React, { useState } from 'react';
import { removeBackground } from "@imgly/background-removal";
import { resizeImage } from './utils/resizeImage';
import CropImage from './CropImage';
import { fillTransparentParts } from './utils/BackgroundFill';
import { convertToBlackAndWhite } from './utils/BlackAndWhite';
import { invertColors } from './utils/InvertColors';
import { saturateImage } from './utils/SaturateImage';

function App() {
  const [image, setImage] = useState(null); // Store the uploaded image as-is
  const [processedImage, setProcessedImage] = useState(null); // For background removal
  const [filledImage, setFilledImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null); // Store the resized image
  const [bwImage, setBwImage] = useState(null); // For B&W
  const [invertedImage, setInvertedImage] = useState(null); // For Inverted Colors
  const [saturatedImage, setSaturatedImage] = useState(null); // For Saturation

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set uploaded image as the image state
        setProcessedImage(null); // Reset the processed image
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate the background removal and color fill once 'Generate' is clicked
  const handleGenerate = async () => {
    if (image) {
        try {
            console.log('Starting background removal...');
            // Process the image with the background removal function
            const blob = await removeBackground(image);
            const url = URL.createObjectURL(blob);
            setProcessedImage(url); // Set the processed image as the processedImage state

            // Create a new image object for the next step
            const img = new Image();
            img.src = url;
            img.onload = async () => {
                console.log('Image loaded, starting to fill transparent parts...');
                const filledBlob = await fillTransparentParts(img, 'blue');
                const filledUrl = URL.createObjectURL(filledBlob);
                setFilledImage(filledUrl); // Set the filled image
            };
        } catch (error) {
            console.error('Error removing background or filling transparent parts:', error);
        }
    } else {
        console.log('No image uploaded.');
    }
};

  const handleResize = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          console.log('Resizing Image...');
          // Resize the image to 55mm in height
          const resizedUrl = await resizeImage(reader.result, 55); 
          console.log('Resized Image URL:', resizedUrl);
          setResizedImage(resizedUrl); // Set the resized image URL
        } catch (error) {
          console.error('Error resizing image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBWImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const bwResult = await convertToBlackAndWhite(reader.result);
        setBwImage(bwResult);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInvertColors = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const inverted = await invertColors(reader.result);
          setInvertedImage(inverted);
        } catch (error) {
          console.error('Error inverting colors:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaturateImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // Adjust the saturation factor as needed (e.g., 1.5 increases saturation, 0.5 decreases)
          const saturated = await saturateImage(reader.result, 1.5);
          setSaturatedImage(saturated);
        } catch (error) {
          console.error('Error saturating image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="App">
      {/* Background Removal */}
      <div>
        <h3>Remove Background</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && <img src={image} alt="Uploaded" style={{ maxWidth: '300px', marginTop: '10px' }} />}
      </div>
      {image && (
        <div className="generate-button">
          <button onClick={handleGenerate}>Generate</button>
        </div>
      )}

      {processedImage && (
        <div className="processed-image">
          <h2>Processed Image</h2>
          <img src={processedImage} alt="Processed" style={{ maxWidth: '300px', marginTop: '10px' }} />
        </div>
      )}

      {/* Filled Image */}
      {filledImage && (
        <div className="filled-image">
          <h2>Filled Image</h2>
          <img src={filledImage} alt="Filled with blue background" style={{ maxWidth: '300px', marginTop: '10px' }} />
        </div>
      )}

      {/* Image Resize */}
      <div>
        <h3>Resize Image</h3>
        <input type="file" accept="image/*" onChange={handleResize} />
        {resizedImage && <img src={resizedImage} alt="Resized" />}
      </div>

      {/* Image Cropping */}
      <div>
        <h3>Crop Image</h3>
        <CropImage />
      </div>

      {/* Make Image Black and White */}
      <div>
        <h3>B&W</h3>
        <input type="file" accept="image/*" onChange={handleBWImageUpload} />
        {bwImage && <img src={bwImage} alt="Black and White" />}
      </div>

      {/* Make Image Color Inverted */}
      <div className="invert-colors">
        <h2>Invert Colors</h2>
        <input type="file" accept="image/*" onChange={handleInvertColors} />
        {invertedImage && <img src={invertedImage} alt="Inverted Colors" />}
      </div>

      {/* Make Image Saturated */}
      <div className="saturate-image">
        <h2>Saturate Image</h2>
        <input type="file" accept="image/*" onChange={handleSaturateImage} />
        {saturatedImage && <img src={saturatedImage} alt="Saturated" />}
      </div>
    </div>
  );
}

export default App;
