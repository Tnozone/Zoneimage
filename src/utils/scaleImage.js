// Function to scale an image to the specified dimensions in millimeters
export const scaleImage = async (imageSrc, targetWidth, targetHeight, dpi = 96) => {
    // Convert millimeters to pixels
    const mmToPx = (mm) => (mm / 25.4) * dpi;
  
    const img = new Image();
    img.src = imageSrc;
  
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Calculate scaling dimensions in pixels
        const originalWidth = img.width;
        const originalHeight = img.height;
  
        const scaledWidth = targetWidth
          ? mmToPx(targetWidth) // Convert target width from mm to pixels
          : (originalWidth * mmToPx(targetHeight)) / originalHeight; // Scale proportionally if only height is provided
        const scaledHeight = targetHeight
          ? mmToPx(targetHeight) // Convert target height from mm to pixels
          : (originalHeight * mmToPx(targetWidth)) / originalWidth; // Scale proportionally if only width is provided
  
        // Create a canvas to draw the scaled image
        const canvas = document.createElement('canvas');
        canvas.width = scaledWidth; // Set the canvas width to the scaled width
        canvas.height = scaledHeight; // Set the canvas height to the scaled height
  
        // Draw the scaled image on the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        resolve(canvas.toDataURL('image/png'));
      };
  
      img.onerror = (error) => reject(error);
    });
  };