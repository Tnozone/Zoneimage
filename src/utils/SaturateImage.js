export const saturateImage = (imageSrc, saturation = 1) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Prevents CORS issues
      img.src = imageSrc;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        // Apply saturation effect
        ctx.filter = `saturate(${saturation})`;
  
        // Re-render the image with the applied filter
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        resolve(canvas.toDataURL('image/jpeg'));
      };
  
      img.onerror = (error) => reject(error);
    });
  };