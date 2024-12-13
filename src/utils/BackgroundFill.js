export function fillTransparentParts(image, fillColor = 'blue') {
  return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;

          // Fill the canvas with the specified color
          ctx.fillStyle = fillColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the image on top of the colored canvas
          ctx.drawImage(image, 0, 0);

          // Export the resulting image
          canvas.toBlob((blob) => {
              if (blob) {
                  resolve(blob);
              } else {
                  reject(new Error('Failed to generate filled image'));
              }
          }, 'image/png');
      };

      image.onerror = () => reject(new Error('Failed to load image'));
  });
}