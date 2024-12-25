import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

export const ManualCrop = ({ imageSrc, onCropParametersChange }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [height, setHeight] = useState(1); // Default height ratio
  const [width, setWidth] = useState(1);  // Default width ratio

  const onCropCompleteHandler = (_, croppedAreaPixels) => {
    if (onCropParametersChange) {
      onCropParametersChange(croppedAreaPixels);
    }
  };

  const handleHeightChange = (event) => {
    const value = parseFloat(event.target.value);
    setHeight(value > 0 ? value : 1); // Ensure height is always positive
  };

  const handleWidthChange = (event) => {
    const value = parseFloat(event.target.value);
    setWidth(value > 0 ? value : 1); // Ensure width is always positive
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Ratio Inputs */}
      <div className='crop-ratio' style={{ marginBottom: '10px' }}>
        <label>
          Height Ratio:
          <input
            type="number"
            value={height}
            onChange={handleHeightChange}
            style={{ marginLeft: '5px', marginRight: '15px' }}
          />
        </label>
        <label>
          Width Ratio:
          <input
            type="number"
            value={width}
            onChange={handleWidthChange}
            style={{ marginLeft: '5px' }}
          />
        </label>
      </div>

      {/* Crop Area */}
      <div className='cropper-preview' style={{ position: 'relative', height: '400px', width: '100%' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={width / height} // Dynamically set the aspect ratio
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>
    </div>
  );
};