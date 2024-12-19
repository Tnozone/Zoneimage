import './App.css';
import React, { useState } from 'react';
import { removeBackground } from '@imgly/background-removal'; // Correct import
import { fillTransparency } from './fillTransparency'; // Import the fill function
import { invertColors } from './utils/InvertColors'; // Import the invertColors function
import { convertToBlackAndWhite } from './utils/BlackAndWhite';
import { adjustSaturation } from './utils/AdjustSaturation';
import { autoCrop as performAutoCrop } from './utils/AutoCrop';
import { ManualCrop } from './ManualCrop';
import { setCropping } from './utils/setCropping';
import { scaleImage } from './utils/scaleImage';

function App() {
  const [image, setImage] = useState(null); // Original image
  const [processedImage, setProcessedImage] = useState(null); // Processed image
  const [backgroundRemoval, setBackgroundRemoval] = useState(false); // Checkbox state for background removal
  const [colorFill, setColorFill] = useState("#ffffff"); // Color for filling transparent parts
  const [invert, setInvert] = useState(false); // Checkbox state for color inversion
  const [blackAndWhite, setBlackAndWhite] = useState(false); // Checkbox state for color inversion
  const [keepTransparent, setKeepTransparent] = useState(false); // Checkbox state for keeping transparency
  const [saturate, setSaturate] = useState(false); // Checkbox state for saturation
  const [desaturate, setDesaturate] = useState(false); // Checkbox state for desaturation
  const [cropEnabled, setCropEnabled] = useState(false); // Checkbox state for cropping
  const [autoCrop, setAutoCrop] = useState(true); // Auto-crop vs manual crop mode
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [scalingEnabled, setScalingEnabled] = useState(false);
  const [scaleHeight, setScaleHeight] = useState('');
  const [scaleWidth, setScaleWidth] = useState('');

  const fillThreshold = 150; // Fixed fill threshold for less aggressive filling (no need for dynamic state)

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Store the base64 image data
        setProcessedImage(null); // Reset processed image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle checkbox toggle for background removal
  const handleBackgroundRemovalChange = () => {
    setBackgroundRemoval(!backgroundRemoval);
  };

  // Handle checkbox toggle for keeping transparency
  const handleKeepTransparentChange = () => {
    setKeepTransparent(!keepTransparent);
  };

  // Handle checkbox toggle for color inversion
  const handleInvertChange = () => {
    setInvert(!invert);
  };

  // Handle mutually exclusive saturation/desaturation checkboxes
  const handleSaturateChange = () => {
    setSaturate(!saturate);
    if (!saturate) setDesaturate(false); // Uncheck desaturate if saturate is checked
  };

  const handleDesaturateChange = () => {
    setDesaturate(!desaturate);
    if (!desaturate) setSaturate(false); // Uncheck saturate if desaturate is checked
  };

  // Handle checkbox toggle for monochrome
  const handleBlackAndWhiteChange = () => {
    setBlackAndWhite(!blackAndWhite);
  };

  // Handle color change (Color Picker)
  const handleColorChange = (event) => {
    setColorFill(event.target.value);
  };

  // Handle Generate button click
  const handleGenerate = async () => {
    if (image) {
      try {
        let processedBlob;

        // Step 1: Background removal
        if (backgroundRemoval) {
          // If background removal is checked, process the image
          const base64ImageData = image.split(',')[1]; // Extract Base64 part from the data URL
          const byteArray = Uint8Array.from(atob(base64ImageData), (c) => c.charCodeAt(0)); // Convert to byte array
          
          // Create a Blob from the byte array
          const imageBlob = new Blob([byteArray], { type: 'image/png' });

          // Process the image using the correct removeBackground function
          processedBlob = await removeBackground(imageBlob);
        } else {
          // If no background removal, convert the image URL to a Blob
          processedBlob = await fetch(image).then((res) => res.blob());
        }

        // Check if the processedBlob is valid before proceeding
        if (!processedBlob) {
          throw new Error('Background removal failed, received invalid Blob.');
        }

        // Create an image object from the processed Blob
        const img = new Image();
        img.src = URL.createObjectURL(processedBlob);
        
        img.onload = async () => {
          // Step 2: Fill fully transparent areas with selected color
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          // Set canvas dimensions to match the image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0);

          // If keep transparency is unchecked, fill transparency
          if (!keepTransparent) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            fillTransparency(ctx, imageData, colorFill, fillThreshold);
          }

          // Convert the canvas back to a Blob and create a URL for the processed image
          const finalBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
          let finalUrl = URL.createObjectURL(finalBlob);

          // Step 3: Invert colors if the checkbox is checked
          if (invert) {
            finalUrl = await invertColors(finalUrl); // Apply color inversion
          }

          // Step 4: Adjust saturation/desaturation
          if (saturate || desaturate) {
            finalUrl = await adjustSaturation(finalUrl, saturate);
          }

          // Step 5: Make black and white if the checkbox is checked
          if (blackAndWhite) {
            finalUrl = await convertToBlackAndWhite(finalUrl); // Apply black and wite
          }

          // Step 7: Cropping
          if (cropEnabled) {
            if (autoCrop) {
              console.log('Performing auto-crop...');
              finalUrl = await performAutoCrop(finalUrl);
            } else {
              console.log('Performing  manual crop...');
              finalUrl = await setCropping(finalUrl, croppedAreaPixels);
            }
          }

          // Step 8: Scaling
          if (scalingEnabled && (scaleWidth || scaleHeight)) {
            finalUrl = await scaleImage(finalUrl, scaleWidth, scaleHeight);
          }

          setProcessedImage(finalUrl);
        };
      } catch (error) {
        console.error('Error during processing:', error);
      }
    } else {
      alert('Please upload an image first.');
    }
  };

  return (
    <div className="App">
      <h1>Image Background Removal & Color Fill</h1>
      
      {/* Image Upload */}
      <div>
        <label htmlFor="image-upload">Upload an Image:</label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      {/* Background Removal Checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={backgroundRemoval}
            onChange={handleBackgroundRemovalChange}
          />
          Remove Background
        </label>
      </div>

      {/* Color Picker for Filling Transparent Areas */}
      <div>
        <label>
          Choose Fill Color:
          <input
            type="color"
            value={colorFill}
            onChange={handleColorChange}
          />
        </label>
      </div>
      {/* Keep Transparency Checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={keepTransparent}
            onChange={handleKeepTransparentChange}
          />
          Keep Transparency
        </label>
      </div>

      {/* Color Inversion Checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={invert}
            onChange={handleInvertChange}
          />
          Invert Colors
        </label>
      </div>

      {/* Saturate Checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={saturate}
            onChange={handleSaturateChange}
          />
          Saturate Image
        </label>
      </div>

      {/* Desaturate Checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={desaturate}
            onChange={handleDesaturateChange}
          />
          Desaturate Image
        </label>
      </div>

      {/* Monochrome Checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={blackAndWhite}
            onChange={handleBlackAndWhiteChange}
          />
          Monochrome
        </label>
      </div>

      {/* Cropping options */}
      <label>
        <input
          type="checkbox"
          checked={cropEnabled}
          onChange={(e) => setCropEnabled(e.target.checked)}
        />
        Enable Cropping
      </label>

      {cropEnabled && (
        <div>
          <label>
            <input
              type="radio"
              checked={autoCrop}
              onChange={() => setAutoCrop(true)}
            />
            Auto-Crop
          </label>
          <label>
            <input
              type="radio"
              checked={!autoCrop}
              onChange={() => setAutoCrop(false)}
            />
            Manual Crop
          </label>
        </div>
      )}

      {/* Render ManualCrop if manual crop is selected */}
      {!autoCrop && cropEnabled && (
        <ManualCrop
          imageSrc={image}
          onCropParametersChange={setCroppedAreaPixels}
        />
      )}

      {/* Scaling Options */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={scalingEnabled}
            onChange={(e) => setScalingEnabled(e.target.checked)}
          />
          Enable Scaling
        </label>
        {scalingEnabled && (
          <div>
            <label>
              Width (mm):
              <input
                type="number"
                value={scaleWidth}
                onChange={(e) => setScaleWidth(e.target.value)}
                disabled={scaleHeight} // Disable if height is set
              />
            </label>
            <label>
              Height (mm):
              <input
                type="number"
                value={scaleHeight}
                onChange={(e) => setScaleHeight(e.target.value)}
                disabled={scaleWidth} // Disable if width is set
              />
            </label>
          </div>
        )}
      </div>

      <button onClick={handleGenerate}>Generate</button>

      <div style={{ marginTop: '20px' }}>
        {image && (
          <div>
            <h3>Original Image:</h3>
            <img src={image} alt="Original" style={{ maxWidth: '100%' }} />
          </div>
        )}

        {processedImage && (
          <div>
            <h3>Processed Image:</h3>
            <img src={processedImage} alt="Processed" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;