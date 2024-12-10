import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Slider from 'react-slider';
import { getCroppedImg } from './utils/cropImage';
import './CropImage.css';

function CropImage() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
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

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedImage);

      // Show or download the cropped image
      console.log('Cropped Image URL:', croppedUrl);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  return (
    <div className="crop-image-container">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <>
          <div className="cropper">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3} // Adjust the aspect ratio as needed
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="controls">
            <label>Zoom</label>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={setZoom}
            />
          </div>
          <button onClick={handleCrop}>Crop Image</button>
        </>
      )}
    </div>
  );
}

export default CropImage;

export const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
  
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    });
  };
  
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });