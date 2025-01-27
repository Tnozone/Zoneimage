import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Gallery.css';
import { deleteImage } from '../utils/deleteImage.js';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch the authentication token from localStorage
                const token = localStorage.getItem('token');
                
                if (!token) {
                    console.error('No authentication token found');
                    return;
                }

                // Send a GET request with the token in the headers
                const response = await axios.get('http://localhost:5000/api/images', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

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

    // Handler function for deleting an image
    const handleDelete = async (imageUrl) => {
        const token = localStorage.getItem('token');
        
        // If no token found, prompt user to log in
        if (!token) {
            alert('Please log in to delete an image');
            return;
        }

        // Call deleteImage function and pass token, image URL, and setImages to update state
        const result = await deleteImage(imageUrl, token, setImages);

        // Provide feedback based on result
        if (result.success) {
            alert('Image deleted successfully!');
        } else {
            alert(result.message);
        }
    };

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
                            <button className='delete-button' onClick={() => handleDelete(image)}>Delete</button>
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