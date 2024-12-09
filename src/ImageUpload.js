import React from 'react';

function ImageUpload({ onImageUpload }) {
  return (
    <div>
      <label htmlFor="file-upload">Upload</label>
      <input id="file-upload" type="file" accept="image/*" onChange={onImageUpload} />
    </div>
  );
}

export default ImageUpload;