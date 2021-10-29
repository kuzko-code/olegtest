import React, { useState, useEffect, useRef } from 'react';
import { useTranslate, withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { postFile, delFile } from '../../services/file-api-services.js';
import { getFileId } from '../../helpers/file-helpers.js';
import { Form } from 'react-bootstrap';
import CustomCarousel from './CustomCarousel.jsx';
import LayoutPreviewRadio from '../common/LayoutPreviewRadio.jsx';
import { useSelector } from 'react-redux';
import { linkRegexp } from '../../constants/index.js';
import CropperModel from '../../components/common/cropper-modal/CropperModel.js';
import { manualCrop } from '../../components/common/cropper-modal/utils.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  translateJsonSchema,
  translateUiSchema,
} from '../../helpers/jsonschema-helpers.js';
import { getBannerById, putBanner } from '../../services/tab-api.js';

const deleteUnsaved = (pictures, selected) => {
  if (pictures.length > 0) {
    const items = [...new Set(pictures)];
    items.forEach((item) => {
      if (item && !selected.includes(item)) {
        delFile(getFileId(item));
      }
    });
  }
};

const CarouselSettingsWithTemplate = ({ type, id, closeModal }) => {
  const translate = useTranslate();
  const language = useSelector((state) => state.Intl.locale);
  const [typeOfView, setTypeOfView] = useState('1.33');
  const [formItems, setFormItems] = useState([]);
  const [schema, setSchema] = useState({});
  const [placeholders, setPlaceholders] = useState({});
  const [initialImages, setInitialImages] = useState([]);
  const initialImagesRef = useRef();
  initialImagesRef.current = initialImages;
  const [unsavedImgs, setUnsavedImgs] = useState([]);
  const unsavedImagesRef = useRef();
  unsavedImagesRef.current = unsavedImgs;
  const [linkErrors, setLinkErrors] = useState([]);
  const [cropObj, setCropObj] = useState({ file: null, index: null }); //Object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBannerById(id).then(({ data, status, error_message }) => {
      if (status !== 'ok') {
        throw error_message;
      }

      if (data.form_data && Array.isArray(data.form_data.elements)) {
        let array = data.form_data.elements;
        array.forEach((item, i) => (item.id = Date.now() + i));
        setFormItems(array);
        setInitialImages([
          ...array.map((item) => item.file),
          ...array.map((item) => item.originalFile),
        ]);
        setTypeOfView(data.form_data.typeOfView);
      } else {
        setFormItems([]);
      }
      setSchema(translateJsonSchema(data.json_schema, translate));
      setPlaceholders(
        translateUiSchema(data.ui_schema, translate)?.elements.items
      );
      setLoading(false);
    });

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
    const formImgs = [
      ...formItems.map((item) => item.file),
      ...formItems.map((item) => item.originalFile),
    ];
    deleteUnsaved(unsavedImgs, formImgs);
    setUnsavedImgs([]);

    let array = JSON.parse(JSON.stringify(formItems));
    array.forEach((item) => delete item.id);

    let body = {
      id,
      form_data: { elements: array, typeOfView },
    };

    //Вне компонента
    putBanner(JSON.stringify(body), language).then((res) => {
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

  const onConfirmCrop = (croppedFile) => {
    postFile(croppedFile).then((res) => {
      const newItems = [...formItems];
      setUnsavedImgs((prevState) => [
        ...prevState,
        newItems[cropObj.index].file,
        res.data.source_url,
      ]);
      newItems[cropObj.index].file = res.data.source_url;
      setFormItems(newItems);
      setCropObj({ file: null, index: null });
      setLoading(false);
    });
  };
  const onDiscard = () => {
    if (!formItems[cropObj.index].file) {
      const newItems = [...formItems];
      newItems[cropObj.index].originalFile = undefined;
      setFormItems(newItems);
    }
    setCropObj({ file: null, index: null });
    setLoading(false);
  };

  const onPictureDrop = (pictureFiles, pictureDataURLs, index) => {
    if (pictureDataURLs.length !== 0) {
      setLoading(true);
      setCropObj({ file: pictureFiles[0], index });
      postFile(pictureFiles[0]).then((res) => {
        const newItems = [...formItems];
        newItems[index].originalFile = res.data.source_url;
        setUnsavedImgs((prevState) => [...prevState, res.data.source_url]);
        setFormItems(newItems);
      });
    } else if (
      formItems[index].file !== undefined &&
      unsavedImgs.length === 0
    ) {
      const newItems = [...formItems];
      setUnsavedImgs((prevState) => [
        ...prevState,
        newItems[index].file,
        newItems[index].originalFile,
      ]);
      newItems[index].file = undefined;
      newItems[index].originalFile = undefined;
      setFormItems(newItems);
    } else if (formItems[index].file) {
      const newItems = [...formItems];
      setUnsavedImgs((prevState) => [
        ...prevState,
        newItems[index].file,
        newItems[index].originalFile,
      ]);
      newItems[index].file = undefined;
      newItems[index].originalFile = undefined;
      setFormItems(newItems);
    }
  };

  const onClickPreview = (event, index) => {
    if (event && event.target && event.target.className == 'uploadPicture') {
      fetch(formItems[index].originalFile)
        .then((res) => res.blob())
        .then((blob) => {
          setCropObj({ file: blob, index });
        });
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

  const handleChangeType = (event) => {
    const target = event.target;
    const id = target.id;
    setTypeOfView(id);
    setLoading(true);

    Promise.all(
      formItems.map((item, index) => {
        if (item.originalFile)
          return manualCrop(item.originalFile, parseFloat(id))
            .then((file) => postFile(file))
            .then((res) => {
              return { res, index };
            });
      })
    ).then((results) => {
      let newItems = [...formItems];
      let unsavedImages = [];
      results.forEach((item) => {
        if (item) {
          unsavedImages.push(newItems[item.index].file);
          newItems[item.index].file = item.res.data.source_url;
          unsavedImages.push(item.res.data.source_url);
        }
      });
      setFormItems(newItems);
      setUnsavedImgs((prevState) => [...prevState, ...unsavedImages]);
      setLoading(false);
    });
  };

  return (
    <>
      <CropperModel
        file={cropObj.file}
        cropperProps={{
          aspectRatio: typeOfView,
        }}
        labels={{
          confirm: translate('save'),
          discard: translate('close'),
          heading: translate('cropImage'),
          zoom: translate('zoom'),
          rotate: translate('rotate'),
        }}
        onConfirm={onConfirmCrop}
        onDiscard={onDiscard}
      />
      <div className="pb-4 bot-settings">
        {loading && (
          <div className="progress-background">
            <CircularProgress />
          </div>
        )}
        <Form.Row className="pb-4">
          <LayoutPreviewRadio
            title={translate('template') + ' 1'}
            name={'typeOfView'}
            id={'1.33'}
            selected={typeOfView == '1.33'}
            src={
              language == 'ua'
                ? `../../../public/assets/pictures/settings/carousel-large_blocks-ua.png`
                : `../../../public/assets/pictures/settings/carousel-large_blocks-en.png`
            }
            onSelect={handleChangeType}
          />
          <LayoutPreviewRadio
            title={translate('template') + ' 2'}
            name={'typeOfView'}
            id={'2'}
            selected={typeOfView == '2'}
            src={
              language == 'ua'
                ? `../../../public/assets/pictures/settings/carousel-medium_blocks-ua.png`
                : `../../../public/assets/pictures/settings/carousel-medium_blocks-en.png`
            }
            onSelect={handleChangeType}
          />
          <LayoutPreviewRadio
            title={translate('template') + ' 3'}
            name={'typeOfView'}
            id={'3'}
            selected={typeOfView == '3'}
            src={
              language == 'ua'
                ? `../../../public/assets/pictures/settings/carousel-small_blocks-ua.png`
                : `../../../public/assets/pictures/settings/carousel-small_blocks-en.png`
            }
            onSelect={handleChangeType}
          />
        </Form.Row>
        {formItems.map((item, i) => (
          <CustomCarousel
            key={item.id}
            index={i}
            titles={schema?.properties?.elements?.items?.properties}
            values={item}
            placeholders={placeholders}
            onDelete={onDelete}
            onUp={onUp}
            onDown={onDown}
            onChange={onChange}
            onDrop={onPictureDrop}
            onClickPreview={onClickPreview}
            isArray={true}
            isLinkValid={linkErrors.includes(i) ? false : true}
          />
        ))}
        {formItems.length < 20 && (
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
        )}
      </div>
      <div className="mainSettingsModal__btnWrapper">
        <button
          type="button"
          className="btn btn-mint-green btn-sm mr-3"
          onClick={onSubmit}
          disabled={loading}
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

export default withTranslate(CarouselSettingsWithTemplate);
