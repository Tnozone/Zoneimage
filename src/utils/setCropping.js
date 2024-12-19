export const setCropping = async (imageSrc, croppedAreaPixels) => {
    if (!imageSrc || !croppedAreaPixels) return null;
  
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      const { width, height, x, y } = croppedAreaPixels;
  
      canvas.width = width;
      canvas.height = height;
  
      ctx.drawImage(
        image,
        x, y, width, height,
        0, 0, width, height
      );
  
      return canvas.toDataURL('image/png'); // Returns the cropped image URL
    } catch (error) {
      console.error('Error generating cropped image:', error);
      throw error;
    }
  };
  
  // Helper function to create an Image object
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
    });