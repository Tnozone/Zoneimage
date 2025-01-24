# Zoneimages

An image editor application where you can crop, scale, remove backgrounds, and modify the colors of your images.

## Technologies

### Front End
* React

### Back End
* Node.js
* Express

### Databases
* Mongodb Atlas
* Google Cloud Storage

### Third Parties
* [face-api.js](https://github.com/justadudewhohacks/face-api.js/)
* [background-removal-js](https://github.com/imgly/background-removal-js)

## How to use
1. Click on "Upload your image" and select the image file you wish to modify.
2. Check the modifications you wish to apply.
3. Click the "Generate" button.
4. Done! Your modified image is there to download.

### Usage Notes
* The new background color defaults to white.
* The automatic cropping option is for portraits and will center in on the face in the photo. If the image has no face detected, it will remain uncropped.
* When using the manual cropping option, you can change the height-to-width ratio with the number inputs and zoom in with your scroll wheel.
* The image scaling uses the inputs to either height or width.
