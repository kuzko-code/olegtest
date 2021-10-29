export const getFileId = (file) => {
	let filePath = require('path').basename(file);
	return filePath.substring(0, filePath.indexOf('_'));
};

export const getFileName = (file) => {
	let filePath = require('path').basename(file);
	return filePath.substring(filePath.indexOf('_') + 1);
};

export const getFileExtensionByName = (filename) => {
	return filename.split('.').pop();
}

export const dataURLtoFile = (dataUrl, filename) => {
	var arr = dataUrl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
};

export function getWidthAndHeight(file) {
	return new Promise(resolve => {
		// this image will hold our source image data
		const inputImage = new Image();
		inputImage.crossOrigin = "Anonymous";

		// we want to wait for our image to load
		inputImage.onload = () => {
			// let's store the width and height of our image
			const inputWidth = inputImage.naturalWidth;
			const inputHeight = inputImage.naturalHeight;
			resolve({ wh: { width: inputWidth, height: inputHeight }, file: file });
		};
		// start loading our image
		inputImage.src = window.URL.createObjectURL(file);
	});
};

export const getIconClassByExtension = (extension) => {
	const fileExtensionList = [
		{ className: 'fa fa-file-text-o', extension: ['txt'] },
		{ className: 'fa fa-file-pdf-o', extension: ['pdf'] },
		{ className: 'fa fa-file-word-o', extension: ['doc', 'docx', 'docm', 'dot', 'dotx', 'rtf'] },
		{ className: 'fa fa-file-excel-o', extension: ['csv', 'xls', 'xlsx', 'xlm'] },
		{ className: 'fa fa-file-powerpoint-o', extension: ['pot', 'potm', 'potx', 'pps', 'ppt'] },
		{ className: 'fa fa-file-image-o', extension: ['apng', 'avif', 'jfif', 'pjpeg', 'pjp', 'svg', 'webp', 'bmp', 'ico', 'cur', 'tif', 'tiff', 'gif', 'png', 'jpg', 'jpeg'] },
		{ className: 'fa fa-file-audio-o', extension: ['aac', 'adt', 'adts', 'mp3', 'm4a', 'wav', 'wma'] },
		{ className: 'fa fa-file-video-o', extension: ['mov', 'mp4', 'avi', 'wmv', 'ogg', 'webm'] },
		{ className: 'fa fa-file-archive-o', extension: ['rar', 'zip', 'iso', '7z'] },
		{ className: 'fa fa-file-code-o', extension: ['js', 'cs', 'xml', 'json', 'aspx', 'htm', 'html', 'sql'] },
	];
	for (const icon of fileExtensionList) {
		if (icon.extension.includes(extension))
			return icon.className;
	}
	return 'fa fa-file-o'; //default
};