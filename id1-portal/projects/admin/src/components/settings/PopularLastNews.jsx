import React, { useEffect, useState } from 'react';
import Form from 'react-jsonschema-form';
import { CustomCheckbox, CustomRadio } from '../ui/customRjsf.js';
import {
  translateJsonSchema,
  translateUiSchema,
} from '../../helpers/jsonschema-helpers.js';
import { useTranslate } from 'react-redux-multilingual';
import { getBannerById, putBanner } from '../../services/tab-api.js';
import { toast } from 'react-toastify';

const PopularLastNews = ({ id, closeModal }) => {
  const translate = useTranslate();
  const widgets = {
    CheckboxWidget: CustomCheckbox,
    RadioWidget: CustomRadio,
  };

  const [banner, setBanner] = useState(null);

  const handleSubmit = async ({ formData }, e) => {
    const data = { id, form_data: formData };
    await putBanner(JSON.stringify(data)).catch((error) =>
      console.log('Error while saving settings :>> ', error)
    );
    toast.success(translate('changesSavedSuccessfully'));
    closeModal();
  };

  useEffect(() => {
    const onInit = async () => {
      try {
        const { data, status, error_message } = await getBannerById(id);

        if (status !== 'ok') {
          throw error_message;
        }

        setBanner(data);
      } catch (error) {
        console.log('Error in Popular/Last News:>> ', error);
      }
    };

    onInit();
  }, []);

  return (
    <>
      {banner && (
        <Form
          className="latestPopularNewsForm"
          schema={translateJsonSchema(banner.json_schema, translate)}
          formData={banner.form_data}
          uiSchema={translateUiSchema(banner.ui_schema, translate)}
          widgets={widgets}
          onSubmit={handleSubmit}
        >
          <div className="mainSettingsModal__btnWrapper">
            <button type="submit" className="btn btn-mint-green btn-sm mr-3">
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
        </Form>
      )}
    </>
  );
};

export default PopularLastNews;
