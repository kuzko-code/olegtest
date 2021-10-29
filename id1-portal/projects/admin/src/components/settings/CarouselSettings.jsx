import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import Cropper from 'react-cropper';
import { Modal } from 'react-bootstrap';

import CustomCarousel from './CustomCarousel.jsx';
import { getBannerById, putBanner } from '../../services/tab-api.js';
import { delFile, postFile } from '../../services/file-api-services.js';
import { getFileId } from '../../helpers/file-helpers.js';
import { linkRegexp } from '../../constants/index.js';
import {
  translateJsonSchema,
  translateUiSchema,
} from '../../helpers/jsonschema-helpers.js';
import 'cropperjs/dist/cropper.css';

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
      if (item && !selected.includes(item)) {
        delFile(getFileId(item));
      }
    });
  }
};

const CarouselSettings = ({ id, type, closeModal }) => {
  const translate = useTranslate();
  const cropperRef = useRef(null);
  const [formItems, setFormItems] = useState([]);
  const [schema, setSchema] = useState({});
  const [placeholders, setPlaceholders] = useState({});
  const [initialImages, setInitialImages] = useState([]);
  const initialImagesRef = useRef();
  initialImagesRef.current = initialImages;
  const [unsavedImgs, setUnsavedImgs] = useState([]);
  const unsavedImagesRef = useRef();
  unsavedImagesRef.current = unsavedImgs;
  const [cropper, setCropper] = useState({
    isActive: false,
    image: null,
    index: null,
    name: null,
  });
  const [linkErrors, setLinkErrors] = useState([]);

  useEffect(() => {
    getBannerById(id)
      .then(({ data, status, error_message }) => {
        if (status === 'ok') {
          setSchema(translateJsonSchema(data.json_schema, translate));
          setPlaceholders(translateUiSchema(data.ui_schema, translate).items);

          if (Array.isArray(data.form_data)) {
            data.form_data.forEach((item, i) => (item.id = Date.now() + i));
            setFormItems(data.form_data);
            setInitialImages(data.form_data.map((item) => item.file));
          } else {
            setFormItems([]);
          }
        }
      })
      .catch((error) => console.log('Error in CarouselSettings:>> ', error));

    return () =>
      deleteUnsaved(unsavedImagesRef.current, initialImagesRef.current);
  }, []);

  const isValid = () => {
    let valid = true;
    formItems.forEach((item) => {
      if (item.file === undefined) {
        valid = false;
      }
    });

    return valid;
  };

  const isLinksValid = () => {
    setLinkErrors([]);
    let errors = [];

    formItems.forEach((item, i) => {
      if (item.url && !item.url.match(linkRegexp)) {
        console.log(i);
        errors.push(i);
      }
    });

    setLinkErrors(errors);

    return errors.length === 0;
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

    const formImgs = formItems.map((item) => item.file);
    deleteUnsaved(unsavedImgs, formImgs);
    setUnsavedImgs([]);

    const form_data = JSON.parse(JSON.stringify(formItems));
    form_data.forEach((item) => delete item.id);

    const body = {
      id,
      form_data,
    };

    //Вне компонента
    putBanner(JSON.stringify(body)).then((res) => {
      if (res.status != 'ok') {
        toast.error(
          type === 'blockLinks'
            ? translate('blockLInksSettingsError')
            : translate('carouselSettingsError')
        );
        return;
      }
      closeModal();
      toast.success(
        type === 'blockLinks'
          ? translate('blockLinksSettingsUpdated')
          : translate('carouselSettingsUpdated')
      );
    });
  };

  const onDelete = (index) => {
    if (formItems[index].file !== undefined) {
      setUnsavedImgs((prevState) => [...prevState, formItems[index].file]);
    }

    const newItems = formItems.filter((item, i) => i !== index);
    setFormItems(newItems);
  };

  const onAdd = () => {
    setFormItems((prevState) => [...prevState, { id: Date.now() }]);
  };

  const onUp = (index) => {
    if (index !== 0) {
      const newItems = [...formItems];
      newItems.splice(index - 1, 2, newItems[index], newItems[index - 1]);
      setFormItems(newItems);
    }
  };

  const onDown = (index) => {
    if (index !== formItems.length - 1) {
      const newItems = [...formItems];
      newItems.splice(index, 2, newItems[index + 1], newItems[index]);
      setFormItems(newItems);
    }
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
      const newItems = [...formItems];
      newItems[cropper.index].file = res.data.source_url;

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
    } else if (
      formItems[index].file !== undefined &&
      unsavedImgs.length === 0
    ) {
      const newItems = [...formItems];
      setUnsavedImgs((prevState) => [...prevState, newItems[index].file]);
      newItems[index].file = undefined;
      setFormItems(newItems);
    } else if (formItems[index].file) {
      const newItems = [...formItems];
      newItems[index].file = undefined;
      setFormItems(newItems);
    }
  };

  const onChange = (event, index) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    const newItems = [...formItems];
    newItems[index][name] = value;
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
      <div className="pb-4 bot-settings">
        {formItems.map((item, i) => (
          <CustomCarousel
            key={item.id}
            index={i}
            titles={schema.items.properties}
            values={item}
            placeholders={placeholders}
            onDelete={onDelete}
            onUp={onUp}
            onDown={onDown}
            onChange={onChange}
            onDrop={onPictureDrop}
            isArray={true}
            isLinkValid={linkErrors.includes(i) ? false : true}
          />
        ))}
        <div style={{ textAlign: 'right' }}>
          <button
            type="button"
            className="btn btn-mint-green btn-add col-xs-12 btnModalAddClose"
            tabIndex="0"
            onClick={onAdd}
          >
            <i className="glyphicon glyphicon-plus"></i>
          </button>
        </div>
      </div>
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
  );
};

export default CarouselSettings;
