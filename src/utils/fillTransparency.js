/**
 * Converts a hex color value to RGB format.
 * @param {string} hex - The hex color string (e.g., '#ff5733').
 * @returns {Object} An object with the RGB values {r, g, b}.
 */
const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };
  
  /**
   * Fills semi-transparent pixels in an image starting from the most transparent pixels.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {ImageData} imageData - The image data to be modified.
   * @param {string} fillColor - The color to fill transparent areas in hex format.
   * @param {number} fillThreshold - The alpha value below which the pixels will be filled.
   * @returns {ImageData} The modified image data with filled transparency.
   */
  export const fillTransparency = (ctx, imageData, fillColor, fillThreshold) => {
    const data = imageData.data;
    const fillRgb = hexToRgb(fillColor);
  
    // Iterate pixels and fill them based on their transparency level
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]; 
  
      // If the pixel is semi-transparent (alpha < 255) and below the threshold, fill it with the color
      if (alpha < 255 && alpha <= fillThreshold) {
        data[i] = fillRgb.r;
        data[i + 1] = fillRgb.g;
        data[i + 2] = fillRgb.b;
        data[i + 3] = 255; // Set alpha to 255 (fully opaque)
      }
    }
  
    // Put the modified image data back onto the canvas
    ctx.putImageData(imageData, 0, 0);
    
    return imageData;
  };