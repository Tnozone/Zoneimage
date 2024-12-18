export const adjustSaturation = (imageSrc, increaseSaturation = true) => {
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
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        // Adjust saturation
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
  
          // Convert to HSL
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = (max + min) / 2;
          const s = max === min ? 0 : l < 128 ? (max - min) / (max + min) : (max - min) / (510 - max - min);
  
          // Adjust saturation
          const newS = increaseSaturation ? Math.min(1, s + 0.3) : Math.max(0, s - 0.3);
  
          // Convert back to RGB
          let newR = r, newG = g, newB = b;
          if (newS !== s) {
            const delta = max - min;
            const add = l < 128 ? delta * newS : delta * newS / (1 - newS);
            const sub = delta - add;
            if (max === r) {
              newR = max;
              newG = l + add * (g - b) / delta;
              newB = l + sub * (g - b) / delta;
            } else if (max === g) {
              newG = max;
              newB = l + add * (b - r) / delta;
              newR = l + sub * (b - r) / delta;
            } else if (max === b) {
              newB = max;
              newR = l + add * (r - g) / delta;
              newG = l + sub * (r - g) / delta;
            }
          }
  
          data[i] = newR;
          data[i + 1] = newG;
          data[i + 2] = newB;
        }
  
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
  
      img.onerror = (error) => reject(error);
    });
  };