import React, { useState, useEffect, useRef } from 'react';
import { useTranslate, withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { postFile, delFile } from '../../services/file-api-services.js';
import { getFileId } from '../../helpers/file-helpers.js';
import Cropper from 'react-cropper';
import { Modal } from 'react-bootstrap';
import CustomCarousel from './CustomCarousel.jsx';
import 'cropperjs/dist/cropper.css';
import { linkRegexp } from '../../constants/index.js';
import {
  translateJsonSchema,
  translateUiSchema,
} from '../../helpers/jsonschema-helpers.js';
import { getBannerById, putBanner } from '../../services/tab-api.js';

const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

const deleteUnsaved = (pictures, selected) => {
  if (pictures.length > 0) {
    pictures.forEach((item) => {
      if (item && item !== selected) {
        delFile(getFileId(item));
      }
    });
  }
};

const LinkWrapperSettings = ({ id, closeModal }) => {
  const cropperRef = useRef(null);
  const translate = useTranslate();
  const [formData, setFormItems] = useState({});
  const [schema, setSchema] = useState(null);
  const [placeholders, setPlaceholders] = useState({});
  const [initialImage, setInitialImage] = useState(null);
  const initialImageRef = useRef();
  initialImageRef.current = initialImage;
  const [unsavedImgs, setUnsavedImgs] = useState([]);
  const unsavedImagesRef = useRef();
  unsavedImagesRef.current = unsavedImgs;
  const [cropper, setCropper] = useState({
    isActive: false,
    image: null,
    index: null,
    name: null,
  });
  const [linkValid, setLinkValid] = useState(true);

  useEffect(() => {
    getBannerById(id)
      .then(({ data, status, error_message }) => {
        if (status !== 'ok') {
          console.log('Error while getting banners:>> ', error_message);
        }

        data.json_schema &&
          setSchema(translateJsonSchema(data.json_schema, translate));
        data.form_data && setFormItems(data.form_data);
        data.ui_schema &&
          setPlaceholders(translateUiSchema(data.ui_schema, translate).items);
        data.form_data && setInitialImage(data.form_data.file);
      })
      .catch((error) => console.log('Error while getting banners:>> ', error));

    return () =>
      deleteUnsaved(unsavedImagesRef.current, initialImageRef.current);
  }, []);

  const isValid = () => formData.file !== undefined;

  const isLinksValid = () => {
    if (formData.url && !formData.url.match(linkRegexp)) {
      setLinkValid(false);
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = () => {
    if (!isValid()) {
      toast.error(translate('carouselImageRequired'));
      return;
    }

    if (!isLinksValid()) {
      toast.error(translate('formValidationError'));
      return;
    }

    deleteUnsaved(unsavedImgs, formData.file);
    setUnsavedImgs([]);

    const form_data = JSON.parse(JSON.stringify(formData));

    //Вне компонента
    putBanner(JSON.stringify({ id, form_data })).then((res) => {
      if (res.status != 'ok') {
        toast.error(translate('linkWrapperSettingsError'));
        return;
      }
      closeModal();
      toast.success(translate('linkWrapperSettingUpdated'));
    });
  };

  const onCrop = () => {
    setCropper((prevState) => ({
      isActive: false,
      image: prevState.image,
      index: prevState.index,
      name: prevState.name,
    }));

    const imageElement = cropperRef?.current;
    const cropperImage = imageElement?.cropper;
    const fileToUpload = dataURLtoFile(
      cropperImage.getCroppedCanvas().toDataURL(),
      `${cropper.name}.png`
    );
    postFile(fileToUpload).then((res) => {
      const newItems = { ...formData };
      newItems.file = res.data.source_url;

      setUnsavedImgs((prevState) => [...prevState, res.data.source_url]);
      setFormItems(newItems);
      setCropper({
        isActive: false,
        image: null,
        index: null,
        name: null,
      });
    });
  };

  const onPictureDrop = (pictureFiles, pictureDataURLs, index) => {
    if (pictureDataURLs.length !== 0) {
      setCropper({
        isActive: true,
        image: pictureDataURLs[0],
        index: index,
        name: pictureFiles[0].name.split('.')[0].substring(0, 90),
      });
    } else if (formData.file !== undefined && unsavedImgs.length === 0) {
      const newItems = { ...formData };
      setUnsavedImgs((prevState) => [...prevState, newItems.file]);
      newItems.file = undefined;
      setFormItems(newItems);
    } else if (formData.file !== undefined) {
      const newItems = { ...formData };
      newItems.file = undefined;
      setFormItems(newItems);
    }
  };

  const onChange = (event, index) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    const newItems = { ...formData };
    newItems[name] = value;
    setFormItems(newItems);
  };

  const onCloseCrop = () =>
    setCropper({
      isActive: false,
      image: null,
      index: null,
      name: null,
    });

  return (
    schema && (
      <>
        <Modal onHide={onCloseCrop} show={cropper.isActive} size="lg">
          <Modal.Body>
            <div>
              <Cropper
                style={{ height: 500, width: '100%' }}
                aspectRatio={parseFloat(schema.aspectRatio)}
                src={cropper.image}
                guides={true}
                rotatable="true"
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                viewMode={1}
                checkOrientation={false}
                ref={cropperRef}
              />
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={onCrop}
                  className="btn btn-info btn-add col-xs-12 mt-3 mr-2"
                >
                  {translate('save')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary col-xs-12 mt-3"
                  onClick={onCloseCrop}
                >
                  {translate('close')}
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <CustomCarousel
          key={1}
          index={1}
          titles={schema.properties}
          onChange={onChange}
          onDrop={onPictureDrop}
          values={formData}
          placeholders={placeholders}
          isArray={false}
          isLinkValid={linkValid}
        />
        <div className="mainSettingsModal__btnWrapper">
          <button
            type="button"
            className="btn btn-mint-green btn-sm mr-3"
            onClick={onSubmit}
            disabled={false}
          >
            {translate('save')}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm btnModalAddClose"
            onClick={closeModal}
          >
            {translate('close')}
          </button>
        </div>
      </>
    )
  );
};

export default withTranslate(LinkWrapperSettings);
