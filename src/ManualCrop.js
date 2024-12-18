import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';

export const ManualCrop = ({ imageSrc, onCropComplete }) => {
  const [cropDimensions, setCropDimensions] = useState({
    width: 200,   // Default width for the crop box
    height: 300,  // Default height for the crop box
    x: 50,        // Default x position of the crop box
    y: 50,        // Default y position of the crop box
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [canvasRef, setCanvasRef] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const imageRef = useRef(null);

  useEffect(() => {
    const loadImage = async () => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImage(img);
      };
    };

    if (imageSrc) {
      loadImage();
    }
  }, [imageSrc]);

  // Handle crop box resize and position
  const handleCropBoxChange = (e) => {
    const { name, value } = e.target;
    setCropDimensions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to generate the crop preview
  const generateCropPreview = () => {
    if (image && canvasRef) {
      const canvas = canvasRef;
      const ctx = canvas.getContext('2d');
      canvas.width = cropDimensions.width;
      canvas.height = cropDimensions.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        cropDimensions.x,
        cropDimensions.y,
        cropDimensions.width,
        cropDimensions.height,
        0,
        0,
        cropDimensions.width,
        cropDimensions.height
      );

      setPreviewUrl(canvas.toDataURL('image/png'));
    }
  };

  // Trigger preview update whenever crop box changes
  useEffect(() => {
    generateCropPreview();
  }, [cropDimensions]);

  const handleCompleteCrop = () => {
    if (image && canvasRef) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = cropDimensions.width;
      canvas.height = cropDimensions.height;
      ctx.drawImage(
        image,
        cropDimensions.x,
        cropDimensions.y,
        cropDimensions.width,
        cropDimensions.height,
        0,
        0,
        cropDimensions.width,
        cropDimensions.height
      );

      onCropComplete(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Crop Aspect Ratio Controls */}
      <div>
        <label>
          Crop Width:
          <input
            type="number"
            name="width"
            value={cropDimensions.width}
            onChange={handleCropBoxChange}
            min="50"
            max={image ? image.width : 1000}
          />
        </label>
        <label>
          Crop Height:
          <input
            type="number"
            name="height"
            value={cropDimensions.height}
            onChange={handleCropBoxChange}
            min="50"
            max={image ? image.height : 1000}
          />
        </label>
      </div>

      {/* Preview Box */}
      {showPreview && (
        <div style={{ marginTop: '20px' }}>
          <h3>Crop Preview:</h3>
          <canvas ref={setCanvasRef} style={{ border: '1px solid black' }}></canvas>
          {previewUrl && (
            <div>
              <h4>Preview:</h4>
              <img src={previewUrl} alt="Crop Preview" style={{ maxWidth: '100%' }} />
            </div>
          )}
        </div>
      )}

      {/* Image Display */}
      {image && (
        <div style={{ marginTop: '20px' }}>
          <h3>Original Image:</h3>
          <img src={image.src} alt="Original" style={{ maxWidth: '100%' }} />
        </div>
      )}

      {/* Crop Complete Button */}
      <div>
        <button onClick={handleCompleteCrop}>Complete Crop</button>
      </div>
    </div>
  );
};
