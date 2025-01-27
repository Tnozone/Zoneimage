# Zoneimages

Image editing site to modify uplaoded pictures.

![exapmle iamge](/src/assets/example-photo.png "Before and After")

## Contributors

[Maxime Nocque](https://github.com/Tnozone)
Cohort 21 [Holberton School](https://www.holbertonschool.com/)

## Technologies

**Front End**
* React

**Back End**
* Node.js
* Express

**Databases**
* Mongodb Atlas - user information
* Google Cloud Storage - image storage

**Third Party Services**
*[background-removal-js](https://github.com/imgly/background-removal-js)
*[face-api.js](https://github.com/justadudewhohacks/face-api.js)

## Features

* Image background removal
* New colored backgrounds
* Image scaling
* Image cropping
* Image color inversion
* Image grayscale
* Image saturation and desaturation
* Save images to cloud storage and display to gallery page

## How to use

On the Edit page, upload pictures witht he "upload" button. Check the desired modifications with the toggles. Click the "generate" button. Your modified image will appear on the page.

**Note:** 
* The new background color defaults to white.
* The automatic cropping option is for portraits and will center in on the face in the photo. If the image has no face detected, it will remain uncropped.
* When using the manual cropping option, you can change the height-to-width ratio with the number inputs and zoom in with your scroll wheel.
* The image scaling uses the inputs to either height or width.

If you have registered an identification and logged in, you can save the image to storage with the "Save Image" button that will appear beneath your modified image. Navigate to the Gallery page to view all of your saved images. Delete any of your images with the delete button underneath.