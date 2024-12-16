import './App.css';
import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { removeBackground } from "@imgly/background-removal";
import { resizeImage } from './utils/resizeImage';
import CropImage from './CropImage';
import { cropImage } from './utils/cropImage';
import { convertToBlackAndWhite } from './utils/BlackAndWhite';
import { invertColors } from './utils/InvertColors';
import { saturateImage } from './utils/SaturateImage';
import { fillTransparentParts } from './utils/BackgroundFill';

function App() {
  const [image, setImage] = useState(null); // Store the uploaded image as-is
  const [processedImage, setProcessedImage] = useState(null); // For background removal
  const [bwImage, setBwImage] = useState(null); // For B&W
  const [invertedImage, setInvertedImage] = useState(null); // For Inverted Colors
  const [saturatedImage, setSaturatedImage] = useState(null); // For Saturation
  const [fillBackground, setFillBackground] = useState(true);
  const [resizeAfterProcess, setResizeAfterProcess] = useState(false);
  const [skipBackgroundRemoval, setSkipBackgroundRemoval] = useState(false); // New state
  const [applyCrop, setApplyCrop] = useState(false); // New state for cropping
  const [autoCrop, setAutoCrop] = useState(true); // State for auto-crop option

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
        let finalBlob;
  
        if (!skipBackgroundRemoval) {
          console.log('Starting background removal...');
          // Remove background
          const removedBackgroundBlob = await removeBackground(image);
          console.log('Background removed:', removedBackgroundBlob);
          finalBlob = removedBackgroundBlob;
        } else {
          console.log('Skipping background removal...');
          finalBlob = await fetch(image).then((res) => res.blob()); // Use original image as Blob
        }
  
        // Fill background if needed
        if (fillBackground) {
          console.log('Filling transparent parts...');
          finalBlob = await fillTransparentParts(finalBlob, 'blue');
          console.log('Transparent parts filled with blue.');
        } else {
          console.log('Keeping original or transparent background.');
        }

        // Apply cropping if enabled
        if (applyCrop) {
          console.log('Applying crop...');
          const cropOptions = autoCrop
            ? { autoCrop: true } // Auto-crop option
            : { manualCrop: true, croppedArea: manualCropArea }; // Manual crop option (ensure `manualCropArea` is captured)
          finalBlob = await cropImage(finalBlob, cropOptions);
          console.log('Cropping completed.');
        }
  
        // Convert Blob to URL
        let finalUrl = URL.createObjectURL(finalBlob);
  
        // Resize if needed
        if (resizeAfterProcess) {
          console.log('Resizing image...');
          const resizedBlob = await resizeImage(finalUrl, 55); // Assuming 55mm height
          finalUrl = resizedBlob;
          console.log('Image resized:', resizedBlob);
        }
  
        setProcessedImage(finalUrl); // Set the final processed image URL
        console.log('Final processed image:', finalUrl);
      } catch (error) {
        console.error('Error during processing:', error);
      }
    } else {
      console.log('No image uploaded.');
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
      <div className="image-upload">
        <h2>Upload an Image</h2>
        <ImageUpload onImageUpload={handleImageUpload} />
        
        {image && <img src={image} alt="Uploaded" style={{ maxWidth: '300px', marginTop: '10px' }} />}
        <label>
          <input
            type="checkbox"
            checked={skipBackgroundRemoval}
            onChange={() => setSkipBackgroundRemoval(!skipBackgroundRemoval)}
          />
          Skip background removal
        </label>
        <label>
          <input
            type="checkbox"
            checked={fillBackground}
            onChange={() => setFillBackground(!fillBackground)}
          />
          Fill background
        </label>
        <label>
          <input
            type="checkbox"
            checked={applyCrop}
            onChange={() => setApplyCrop(!applyCrop)}
          />
          Apply cropping
        </label>

        {applyCrop && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={autoCrop}
                onChange={() => setAutoCrop(!autoCrop)}
              />
              Auto-crop
            </label>
            <p>Or manually crop the image below:</p>
            <CropImage />
          </div>
        )}
        <label>
          <input
            type="checkbox"
            checked={resizeAfterProcess}
            onChange={() => setResizeAfterProcess(!resizeAfterProcess)}
          />
          Resize to passport height - 45mm
        </label>
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
