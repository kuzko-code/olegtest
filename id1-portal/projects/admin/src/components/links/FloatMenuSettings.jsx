import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { Form as FormBootstrap } from 'react-bootstrap';
import Form from 'react-jsonschema-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { linkRegexp } from '../../constants';
import { pressEnterPreventDefault } from '../../services/helpers.js';
import {
  getSettingByTitle,
  updateSettingsByTitle,
} from '../../services/index.js';
import {
  translateJsonSchema,
  translateUiSchema,
} from '../../helpers/jsonschema-helpers.js';

const FloatMenuSettings = () => {
  const translate = useTranslate();
  const language = useSelector((state) => state.Intl.locale);
  const pluginsData = useSelector((state) => state.reducerPlugins);

  const [formSchema, setFormSchema] = useState({ schema: {} });
  const [formData, setFormData] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    getSettingByTitle('usefulLinks', language).then(
      ({ data, status, error_message }) => {
        if (status !== 'ok') {
          console.log('Error in getSettings:>> ', error_message);
          return;
        }

        setFormSchema({
          schema: data.settings_schema,
          uiSchema: data.ui_schema,
        });
        const formData =
          Object.keys(data.settings_object).length === 0
            ? []
            : data.settings_object;
        setFormData(formData);
        setInitialData(JSON.stringify(formData));
      }
    );
  }, []);

  useEffect(() => {
    let isChanged = false;

    const newFormData = formData.map((item) => {
      if (typeof item.title === 'object') {
        if (!item.title) {
          return;
        }
        isChanged = true;
        return { title: item.title.title, url: item.title.url };
      }
      return item;
    });

    if (isChanged) {
      setFormData(newFormData);
    } else {
      return;
    }
  }, [formData]);

  useEffect(() => {
    window.addEventListener('keydown', pressEnterPreventDefault);
    return () => {
      window.removeEventListener('keydown', pressEnterPreventDefault);
    };
  }, []);

  const handleSubmit = ({ formData }, e) => {
    updateSettingsByTitle(
      'usefulLinks',
      language,
      JSON.stringify(formData)
    ).then((res) => {
      if (res.status !== 'ok') {
        toast.error(translate('errorOccurredWhileSavingGovLinks'));
        return;
      }
      setInitialData(JSON.stringify(formData));
      setIsSubmitDisabled(true);
      toast.success(translate('changesSavedSuccessfully'));
    });
  };

  const handleChange = ({ formData, errors }) => {
    const currentData = JSON.stringify(formData);
    if (errors.length > 0) {
      setFormData(formData);
      setIsSubmitDisabled(false);
      return;
    }

    if (initialData !== currentData) {
      setFormData(formData);
      setIsSubmitDisabled(false);
      return;
    }

    setFormData(formData);
    setIsSubmitDisabled(true);
  };

  const validate = (formData, errors) => {
    let isError = false;

    formData.forEach((item, i) => {
      if (!item.title?.trim() || !item.url?.trim()) {
        errors[i].addError(translate('linkFieldsRequired'));
        isError = true;
      }

      if (!item.url?.match(linkRegexp) || item.title?.length > 50) {
        isError = true;
      }
    });

    if (isError) {
      toast.error(translate('formValidationError'));
    }

    return errors;
  };

  const transformErrors = (errors) => {
    return errors.map((error) => {
      if (error.name === 'pattern') {
        error.message = translate('linkFormat');
      }

      if (error.name === 'maxLength') {
        error.message = translate('quickMenuLinkTitleTooLong');
      }

      if (
        (error.name === 'type' && error.message === 'should be string') ||
        error.name === 'required'
      ) {
        error.message = translate('shouldBeString');
      }
      return error;
    });
  };

  const autocompleteList = pluginsData
    .map((plugin) => {
      return plugin.publicPages.map((publicPage) => {
        const name = translate(publicPage.translateName)
          ? translate(publicPage.translateName)
          : publicPage.name;

        if (name)
          return {
            url: `${process.env.PUBLIC_HOST}/${language}/plugins/${
              plugin.name
            }${
              publicPage.url.startsWith('/')
                ? publicPage.url
                : '/' + publicPage.url
            }`,
            title: name,
          };
      });
    })
    .flat();

  const customFields = {
    StringField: (data) => {
      return (
        <Autocomplete
          value={data.formData}
          options={data.name === 'title' ? autocompleteList : []}
          onChange={(e, value) => {
            data.onChange(value);
          }}
          getOptionLabel={(data) => {
            if (typeof data === 'object') {
              return data.title;
            }
            return data;
          }}
          autoSelect
          freeSolo
          renderInput={(params) => {
            return (
              <div ref={params.InputProps.ref}>
                <FormBootstrap.Control type="text" {...params.inputProps} />
              </div>
            );
          }}
        />
      );
    },
  };

  return (
    <div>
      <div className="pageElementBox collapsed border-bottom govSettings">
        {formSchema != null && (
          <div>
            <div className="pageElementBoxTitle border-bottom-0 d-flex justify-content-between">
              <h5>{translate('usfullLinksWidget')}</h5>
              <button
                type="submit"
                className="btn btn-mint-green btn-sm"
                form="floatMenu-form"
                disabled={isSubmitDisabled}
              >
                {translate('saveChanges')}
              </button>
            </div>
            <div className="pageElementBoxContent" style={{ display: 'block' }}>
              <Form
                schema={translateJsonSchema(formSchema.schema, translate)}
                formData={formData}
                uiSchema={translateUiSchema(formSchema.uiSchema, translate)}
                fields={customFields}
                onSubmit={handleSubmit}
                validate={validate}
                onChange={handleChange}
                transformErrors={transformErrors}
                id="floatMenu-form"
                className="rjsForm"
              >
                <div>
                  <button type="submit" disabled className="d-none" />
                </div>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatMenuSettings;
