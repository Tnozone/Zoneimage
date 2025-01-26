// Function to crop an image to a specified area
export const setCropping = async (imageSrc, croppedAreaPixels) => {
    if (!imageSrc || !croppedAreaPixels) return null;
  
    try {
      const image = await createImage(imageSrc);

      // Create a canvas element to perform cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Destructure cropping dimensions from the croppedAreaPixels object
      const { width, height, x, y } = croppedAreaPixels;
  
      // Set the canvas dimensions to match the cropped area's width and height
      canvas.width = width;
      canvas.height = height;
  
      // Draw the cropped portion of the image onto the canvas
      ctx.drawImage(
        image,
        x, y, width, height,
        0, 0, width, height
      );
  
      return canvas.toDataURL('image/png');
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