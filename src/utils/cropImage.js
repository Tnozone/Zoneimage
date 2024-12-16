import autoCropImage from "../CropImage";
import manualCropImage from "../CropImage";

export const cropImage = async (imageBlob, options) => {
  const imageSrc = URL.createObjectURL(imageBlob);

  if (options.autoCrop) {
    console.log('Performing auto-crop...');
    return autoCropImage(imageSrc);
  } else if (options.manualCrop) {
    console.log('Performing manual crop...');
    if (!options.croppedArea) {
      throw new Error('Manual crop requires cropped area pixels.');
    }
    return manualCropImage(imageSrc, options.croppedArea);
  }

  return imageBlob; // Return original image if no cropping is needed
};