export function getFileInfo(file, mime = '') {
	const pos = String(file.name).lastIndexOf('.');

	if (mime === 'image/jpeg') {
		const filename = `${String(file.name)
			.substr(0, pos < 0 ? String(file.name).length : pos)}.jpg`;
		return {
			filename,
			mime: 'image/jpeg'
		};
	}

	return {
		filename: file.name,
		mime: file.type,
	};
}
export function manualCrop(url, aspectRatio) {
	return new Promise(resolve => {
		// this image will hold our source image data
		const inputImage = new Image();
		inputImage.crossOrigin = "Anonymous";

		// we want to wait for our image to load
		inputImage.onload = () => {

			// let's store the width and height of our image
			const inputWidth = inputImage.naturalWidth;
			const inputHeight = inputImage.naturalHeight;

			// get the aspect ratio of the input image
			const inputImageAspectRatio = inputWidth / inputHeight;

			// if it's bigger than our target aspect ratio
			let outputWidth = inputWidth;
			let outputHeight = inputHeight;
			if (inputImageAspectRatio > aspectRatio) {
				outputWidth = inputHeight * aspectRatio;
			} else if (inputImageAspectRatio < aspectRatio) {
				outputHeight = inputWidth / aspectRatio;
			}

			// calculate the position to draw the image at
			const outputX = (outputWidth - inputWidth) * .5;
			const outputY = (outputHeight - inputHeight) * .5;

			// create a canvas that will present the output image
			const outputImage = document.createElement('canvas');

			// set it to the same size as the image
			outputImage.width = outputWidth;
			outputImage.height = outputHeight;

			// draw our image at position 0, 0 on the canvas
			const ctx = outputImage.getContext('2d');
			ctx.drawImage(inputImage, outputX, outputY);
			outputImage.toBlob(function(blob){resolve(blob);});
		};
		// start loading our image
		inputImage.src = url;
	});

};