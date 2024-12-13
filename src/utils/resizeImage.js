export const resizeImage = (imageSrc, targetHeightInMm) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        console.log('Image loaded:', img);
        const width = img.width;
        const height = img.height;
  
        // Convert target height in mm to pixels (assuming 96 dpi)
        const targetHeightInPx = (targetHeightInMm * 96) / 25.4; // 96 DPI
        console.log('Target Height in Pixels:', targetHeightInPx);
        console.log('Original Image Dimensions:', width, height);
  
        const scaleFactor = targetHeightInPx / height;
        const newWidth = width * scaleFactor;
  
        console.log('New Dimensions:', newWidth, targetHeightInPx);
  
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = newWidth;
        canvas.height = targetHeightInPx;
  
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, newWidth, targetHeightInPx);
  
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
          } else {
            resolve(URL.createObjectURL(blob));
          }
        }, 'image/jpeg');
      };
  
      img.onerror = (error) => reject(error);
    });
  };