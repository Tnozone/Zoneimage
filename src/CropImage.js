import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop'; // Add Cropper for manual cropping
import { loadModels, detectFace, createImage } from './faceApiUtils';

function CropImage() {
  const [image, setImage] = useState(null);
  const [autoCrop, setAutoCrop] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Manual cropping states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Dynamic aspect ratio states
  const [aspectWidth, setAspectWidth] = useState(45);
  const [aspectHeight, setAspectHeight] = useState(35);

  useEffect(() => {
    loadModels().then(() => {
      setModelsLoaded(true);
      console.log('FaceAPI models loaded');
    });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const autoCropImage = async (imageSrc) => {
    const img = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get 2D context.');
    }

    // Detect face
    const faceRegion = await detectFace(imageSrc);
    if (!faceRegion) {
      throw new Error('No face detected for auto-cropping.');
    }

    const aspectRatio = 45 / 35;
    const faceCenterX = faceRegion.x + faceRegion.width / 2;
    const faceCenterY = faceRegion.y + faceRegion.height / 2;

    // Adjust to ensure the face is positioned lower within the crop
    const verticalOffset = faceRegion.height * 0.2; // Adjust the value as needed
    const adjustedFaceCenterY = faceCenterY - verticalOffset; // Subtract to lower the face

    // Calculate crop dimensions ensuring face occupies 65-75% of height
    const cropHeight = faceRegion.height / 0.7; // Adjust height for ~70% face coverage
    const cropWidth = cropHeight * aspectRatio;

    // Prevent crop region from exceeding image dimensions
    const cropX = Math.max(0, Math.min(faceCenterX - cropWidth / 2, img.width - cropWidth));
    const cropY = Math.max(0, Math.min(adjustedFaceCenterY - cropHeight / 2, img.height - cropHeight));

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight, // Source
      0, 0, canvas.width, canvas.height   // Destination
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty.'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const manualCropImage = async (imageSrc, croppedArea) => {
    const img = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get 2D context.');
    }

    canvas.width = croppedArea.width;
    canvas.height = croppedArea.height;

    ctx.drawImage(
      img,
      croppedArea.x, croppedArea.y, croppedArea.width, croppedArea.height, // Source
      0, 0, canvas.width, canvas.height   // Destination
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty.'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleCrop = async () => {
    if (!modelsLoaded) {
      console.error('Models not yet loaded, please wait.');
      return;
    }

    if (autoCrop && image) {
      try {
        const autoCroppedImage = await autoCropImage(image);
        const autoCroppedUrl = URL.createObjectURL(autoCroppedImage);
        setCroppedImageUrl(autoCroppedUrl);
      } catch (error) {
        console.error('Error during auto-crop:', error);
      }
    } else if (!autoCrop && image && croppedAreaPixels) {
      try {
        const manualCroppedImage = await manualCropImage(image, croppedAreaPixels);
        const manualCroppedUrl = URL.createObjectURL(manualCroppedImage);
        setCroppedImageUrl(manualCroppedUrl);
      } catch (error) {
        console.error('Error during manual crop:', error);
      }
    } else {
      console.log('No cropping action taken.');
    }
  };

  return (
    <div className="crop-image-container">
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {image && (
        <>
          <div className="auto-crop-option">
            <label>
              <input
                type="checkbox"
                checked={autoCrop}
                onChange={() => setAutoCrop(!autoCrop)}
              />
              Auto-crop to 45x35 ratio with face centered
            </label>
          </div>

          {/* Dynamic Aspect Ratio Controls */}
          {!autoCrop && (
            <div className="aspect-ratio-controls">
              <label>
                Aspect Width:
                <input
                  type="number"
                  value={aspectWidth}
                  onChange={(e) => setAspectWidth(Number(e.target.value))}
                  min="1"
                />
              </label>
              <label>
                Aspect Height:
                <input
                  type="number"
                  value={aspectHeight}
                  onChange={(e) => setAspectHeight(Number(e.target.value))}
                  min="1"
                />
              </label>
            </div>
          )}

          {/* Manual Cropper Preview */}
          {!autoCrop && (
            <div className="cropper-preview" style={{ marginTop: '20px' }}>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspectWidth / aspectHeight} // Dynamic aspect ratio
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          <button onClick={handleCrop}>Crop Image</button>

          {/* Display Cropped Result */}
          {croppedImageUrl && (
            <div className="cropped-image-preview" style={{ marginTop: '20px' }}>
              <h3>Cropped Image:</h3>
              <img src={croppedImageUrl} alt="Cropped" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CropImage;