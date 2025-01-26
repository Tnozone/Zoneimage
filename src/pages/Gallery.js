import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Gallery.css';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch image data from the API
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/images');
                const imageUrls = response.data.images;
                setImages(imageUrls);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return <div className='loading'>Loading images...</div>;
    }

    return (
        <main>
            <div className="gallery">
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} className="gallery-item">
                            <img src={image} alt={`Gallery item ${index + 1}`} />
                        </div>
                    ))
                ) : (
                    <p>No images to display</p>
                )}
            </div>
        </main>
    );
};

export default Gallery;