import './App.css';
import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import imglyRemoveBackground from "@imgly/background-removal";

function App() {
  const [image, setImage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const blob = await imglyRemoveBackground(file);
      const url = URL.createObjectURL(blob);
      setImage(url);
    }
  };

  return (
    <div className="App">
      <ImageUpload onImageUpload={handleImageUpload} />
      {image && <img src={image} alt="Processed" />}
    </div>
  );
}

export default App;
