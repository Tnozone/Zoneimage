export const scaleImage = async (imageSrc, targetWidth, targetHeight, dpi = 96) => {
    // Convert millimeters to pixels
    const mmToPx = (mm) => (mm / 25.4) * dpi;
  
    const img = new Image();
    img.src = imageSrc;
  
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Calculate scaling dimensions
        const originalWidth = img.width;
        const originalHeight = img.height;
  
        const scaledWidth = targetWidth
          ? mmToPx(targetWidth)
          : (originalWidth * mmToPx(targetHeight)) / originalHeight;
        const scaledHeight = targetHeight
          ? mmToPx(targetHeight)
          : (originalHeight * mmToPx(targetWidth)) / originalWidth;
  
        const canvas = document.createElement('canvas');
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        resolve(canvas.toDataURL('image/png'));
      };
  
      img.onerror = (error) => reject(error);
    });
  };