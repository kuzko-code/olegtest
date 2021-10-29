import React from 'react';
import '../../public/assets/css/components/attachment-item.css'

const getIconByExtension = (extension) => {
    const folderPath = "/public/assets/pictures/file-icon";
    const fileExtensionList = [
        { src: folderPath + "/file.svg", extension: ['txt'] },
        { src: folderPath + "/acrobat_pdf.svg", extension: ['pdf'] },
        { src: folderPath + "/microsoft_office_word.svg", extension: ['doc', 'docx', 'docm', 'dot', 'dotx', 'rtf'] },
        { src: folderPath + "/microsoft_office_excel.svg", extension: ['csv', 'xls', 'xlsx', 'xlm'] },
        { src: folderPath + "/microsoft_office_power_point.svg", extension: ['pot', 'potm', 'potx', 'pps', 'ppt', 'pptx'] },
        { src: folderPath + "/photo_file.svg", extension: ['apng', 'avif', 'jfif', 'pjpeg', 'pjp', 'svg', 'webp', 'bmp', 'ico', 'cur', 'tif', 'tiff', 'gif', 'png', 'jpg', 'jpeg'] },
        { src: folderPath + "/audio_file.svg", extension: ['aac', 'adt', 'adts', 'mp3', 'm4a', 'wav', 'wma'] },
        { src: folderPath + "/video_file.svg", extension: ['mov', 'mp4', 'avi', 'ogg', 'webm', 'wmv'] },
        { src: folderPath + "/zip_file.svg", extension: ['rar', 'zip', 'iso', '7z'] },
        { src: folderPath + "/code_file.svg", extension: ['js', 'cs', 'xml', 'json', 'aspx', 'htm', 'html', 'sql'] },
    ];
    for (const icon of fileExtensionList) {
        if (icon.extension.includes(extension))
            return icon.src;
    }
    return folderPath + "/file.svg"; //default
};


const AttachmentItem = (props) => {
    const { href, name } = props;
    return (
        <div className="attachment-item" >
            <span className="attachment-icon"><img width="30" src={getIconByExtension(name.split('.').pop() || "")} /></span>
            <a className="attachment-link" target="_blank" href={href}>{name}</a>
        </div>);
}

export default AttachmentItem;
