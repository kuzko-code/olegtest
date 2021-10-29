import React from 'react';
import { useTranslate } from 'react-redux-multilingual';
import Checkbox from '@material-ui/core/Checkbox';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getFileExtensionByName, getIconClassByExtension } from '../../helpers/file-helpers.js'

const FileView = ({ file, onClickDeleteFile, onShowFileName, imageInsteadOfIcon = true }) => {
  const translate = useTranslate();

  const copySelectedDocument = (e) => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = file.source_url;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  const onCheckboxChange = () => {
    onShowFileName(file.id);
  };

  const onClickDelete = () => {
    onClickDeleteFile(file.id);
  };
  const imgExtension = ['apng', 'avif', 'jfif', 'pjpeg', 'pjp', 'svg', 'webp', 'bmp', 'ico', 'cur', 'tif', 'tiff', 'gif', 'png', 'jpg', 'jpeg'];
  const iconClassName = getIconClassByExtension(getFileExtensionByName(file.storage_key));
  return (
    <div className="inline d-flex folder-item folder-item-link container">
      <div className="mr-auto overflow-hidden">
        <div className="d-flex">
          <div className="mr-4">
            <span className="link">
              {imageInsteadOfIcon && imgExtension.includes(getFileExtensionByName(file.storage_key)) ?
                <img style={{ maxHeight: '40px', maxWidth: '80px' }} src={file.source_url} alt={file.storage_key} /> :
                <i style={{ fontSize: 'xx-large' }} className={`${iconClassName}`}></i>
              }
            </span>
          </div>
          <div className="link">
            <p>{file.storage_key}</p>
          </div>
        </div>
      </div>
      <div>
        <div className="d-flex">
          {!!onShowFileName && (
            <OverlayTrigger
              overlay={<Tooltip>{translate('showDocName')}</Tooltip>}
            >
              <Checkbox
                style={{ color: '#43a047' }}
                checked={file.is_active}
                onChange={onCheckboxChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </OverlayTrigger>
          )}
          <OverlayTrigger overlay={<Tooltip>{translate('copyUrl')}</Tooltip>}>
            <button
              className="btn p-0 mr-1"
              style={{ color: 'rgb(1, 153, 204)' }}
              type="button"
              value={file.source_url}
              onClick={copySelectedDocument}
            >
              <FileCopyIcon fontSize="small" />
            </button>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={<Tooltip>{translate('delete')}</Tooltip>}
          >
            <button className="btn p-0" type="button" onClick={onClickDelete}>
              <DeleteIcon style={{ color: 'red', width: 23 }} />
            </button>
          </OverlayTrigger>
        </div>
      </div>
    </div>
  );
};

export default FileView;
