import './Editor.css';
import React, { useState } from 'react';
import axios from 'axios';
import { removeBackground } from '@imgly/background-removal';
import { fillTransparency } from '../fillTransparency.js';
import { invertColors } from '../utils/InvertColors.js';
import { convertToBlackAndWhite } from '../utils/BlackAndWhite.js';
import { adjustSaturation } from '../utils/AdjustSaturation.js';
import { autoCrop as performAutoCrop } from '../utils/AutoCrop.js';
import { ManualCrop } from '../ManualCrop.js';
import { setCropping } from '../utils/setCropping.js';
import { scaleImage } from '../utils/scaleImage.js';

function Editor() {
    const [image, setImage] = useState(null); // Original image
    const [fileName, setFileName] = useState("Upload Image"); // file name
    const [processedImage, setProcessedImage] = useState(null); // Processed image
    const [backgroundRemoval, setBackgroundRemoval] = useState(false); // Checkbox state for background removal
    const [colorFill, setColorFill] = useState("#ffffff"); // Color for filling transparent background
    const [invert, setInvert] = useState(false); // Checkbox state for color inversion
    const [blackAndWhite, setBlackAndWhite] = useState(false); // Checkbox state for black and white
    const [keepTransparent, setKeepTransparent] = useState(false); // Checkbox state for keeping transparency
    const [saturate, setSaturate] = useState(false); // Checkbox state for saturation
    const [desaturate, setDesaturate] = useState(false); // Checkbox state for desaturation
    const [cropEnabled, setCropEnabled] = useState(false); // Checkbox state for cropping
    const [autoCrop, setAutoCrop] = useState(true); // Auto-crop vs manual crop mode
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [scalingEnabled, setScalingEnabled] = useState(false); // Checkbox state for saling
    const [scaleHeight, setScaleHeight] = useState('');
    const [scaleWidth, setScaleWidth] = useState('');
    const [errorNotification, setErrorNotification] = useState('');

    const [progress, setProgress] = useState(0);
    const [showProgressBar, setShowProgressBar] = useState(false);
  
    const fillThreshold = 150; // Fixed fill threshold for less aggressive filling
  
    // Handle image upload
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const truncatedName =
          file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name;
        setFileName(truncatedName);
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result); // Store the base64 image data
          setProcessedImage(null); // Reset processed image
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSaveImage = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.post(
              'http://localhost:5000/api/images/save',
              { imageUrl: processedImage },
              { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
          );
          console.log('Server response:', response.data);
          alert('Image saved successfully!');
      } catch (error) {
          console.error('Error saving image:', error);
          alert('Failed to save the image.');
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

        setShowProgressBar(true); // Show the progress bar
        setProgress(0); // Reset progress

        try {
          let processedBlob;
  
          // Step 1: Background removal
          if (backgroundRemoval) {
            setProgress(20);
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
          setProgress(30);
  
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
            setProgress(40);
  
            // Convert the canvas back to a Blob and create a URL for the processed image
            const finalBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
            let finalUrl = URL.createObjectURL(finalBlob);
  
            // Step 3: Invert colors if the checkbox is checked
            if (invert) {
              finalUrl = await invertColors(finalUrl); // Apply color inversion
            }
            setProgress(50);
  
            // Step 4: Adjust saturation/desaturation
            if (saturate || desaturate) {
              finalUrl = await adjustSaturation(finalUrl, saturate);
            }
            setProgress(60);
  
            // Step 5: Make black and white if the checkbox is checked
            if (blackAndWhite) {
              finalUrl = await convertToBlackAndWhite(finalUrl); // Apply black and wite
            }
            setProgress(80);
  
            // Step 7: Cropping
            if (cropEnabled) {
              if (autoCrop) {
                console.log('Performing auto-crop...');
                const croppedImageUrl = await performAutoCrop(finalUrl);
                if (croppedImageUrl === finalUrl) {
                  setErrorNotification('No face detected. The image was not cropped.');
                }
                finalUrl = croppedImageUrl;
              } else {
                console.log('Performing  manual crop...');
                finalUrl = await setCropping(finalUrl, croppedAreaPixels);
              }
            }
            setProgress(90);
  
            // Step 8: Scaling
            if (scalingEnabled && (scaleWidth || scaleHeight)) {
              finalUrl = await scaleImage(finalUrl, scaleWidth, scaleHeight);
            }
            setProgress(100);
  
            setProcessedImage(finalUrl);
          };
        } catch (error) {
          console.error('Error during processing:', error);
        } finally {
          setTimeout(() => setShowProgressBar(false), 1000); // Hide after 1s delay for smooth transition
        }
      } else {
        alert('Please upload an image first.');
      }
    };
  
    return (
      <main>
        <div className="editor">
          <h1>Image Editor</h1>
          
          {/* Image Upload */}
          <div>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="image-upload"
              id="image-upload-label"
              className="upload-button"
            >
              {fileName}
            </label>
          </div>
  
          {/* Background Removal Checkbox */}
          <div className='backgrounds'>
            <label>
              <input
                type="checkbox"
                checked={backgroundRemoval}
                onChange={handleBackgroundRemovalChange}
              />
              Remove Background
            </label>
  
            {/* Color Picker for Filling Transparent Areas */}
            <label>
              Choose Background Color:
              <input
                type="color"
                value={colorFill}
                onChange={handleColorChange}
              />
            </label>
            {/* Keep Transparency Checkbox */}
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
          <div className='colors'>
            <label>
              <input
                type="checkbox"
                checked={invert}
                onChange={handleInvertChange}
              />
              Invert Colors
            </label>
  
            {/* Saturate Checkbox */}
            <label>
              <input
                type="checkbox"
                checked={saturate}
                onChange={handleSaturateChange}
              />
              Saturate
            </label>
  
            {/* Desaturate Checkbox */}
            <label>
              <input
                type="checkbox"
                checked={desaturate}
                onChange={handleDesaturateChange}
              />
              Desaturate
            </label>
  
            {/* Monochrome Checkbox */}
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
          <div className='cropping'>
            <label>
              <input
                type="checkbox"
                checked={cropEnabled}
                onChange={(e) => setCropEnabled(e.target.checked)}
              />
              Crop
            </label>
  
            {cropEnabled && (
              <div className='radioswitch'>
                <div className='radio-container'>
                  <input
                      type="radio"
                      id="auto-crop"
                      checked={autoCrop}
                      onChange={() => setAutoCrop(true)}
                    />
                  <label htmlFor="auto-crop">Auto-Crop</label>
                  <input
                      type="radio"
                      id="manual-crop"
                      checked={!autoCrop}
                      onChange={() => setAutoCrop(false)}
                    />
                  <label htmlFor="manual-crop">Manual Crop</label>
                </div>
                {errorNotification && <div className="notification">{errorNotification}</div>}
              </div>
            )}
  
            {/* Render ManualCrop if manual crop is selected */}
            {!autoCrop && cropEnabled && (
              <ManualCrop
                imageSrc={image}
                onCropParametersChange={setCroppedAreaPixels}
              />
            )}
          </div>
  
          {/* Scaling Options */}
          <div className='scaling'>
            <label>
              <input
                type="checkbox"
                checked={scalingEnabled}
                onChange={(e) => setScalingEnabled(e.target.checked)}
              />
              Scale
            </label>
            {scalingEnabled && (
              <div className='scaling-labels'>
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
  
          <button className="generate" onClick={handleGenerate}>Generate</button>

          {showProgressBar && (
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          )}
  
          <div className='result' style={{ marginTop: '20px' }}>
            {processedImage && (
              <div>
                <h3>Processed Image:</h3>
                <img src={processedImage} alt="Processed" style={{ maxWidth: '100%' }} />
                <button onClick={handleSaveImage}>Save Image</button>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

export default Editor;