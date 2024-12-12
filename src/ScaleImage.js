

function scaleImage(image, targetWidth, targetHeight) {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    // Calculate the scale factor to maintain the aspect ratio
    const aspectRatio = image.width / image.height;
    let newWidth, newHeight;
  
    if (image.width / targetWidth > image.height / targetHeight) {
      // Scale based on width
      newWidth = targetWidth;
      newHeight = targetWidth / aspectRatio;
    } else {
      // Scale based on height
      newHeight = targetHeight;
      newWidth = targetHeight * aspectRatio;
    }
  
    // Set the canvas size to the scaled dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;
  
    // Draw the scaled image on the canvas
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
  
    // Return the scaled image as a data URL or blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
    });
  }