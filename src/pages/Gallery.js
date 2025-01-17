import React, { useEffect, useState } from 'react';
import './Gallery.css';

const Gallery = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
        setImages(savedImages);
    }, []);

    return (
        <main>
            <div className="gallery">
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`Saved ${index}`} style={{ maxWidth: '100%' }} />
                ))}
            </div>
        </main>
    );
};

export default Gallery;