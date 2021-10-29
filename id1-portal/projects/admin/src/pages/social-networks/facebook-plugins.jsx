import React, { useEffect, useState } from 'react';
import Form from 'react-jsonschema-form';
import { toast } from 'react-toastify';
import { getFacebookSettings, updateFacebookSettings } from "../../services/social_networks-api-services.js";
import { translateJsonSchema } from "../../helpers/jsonschema-helpers.js";
import { useTranslate } from 'react-redux-multilingual';
import { CustomCheckbox } from '../../components/ui/customRjsf.js';


const Facebook = (props) => {
    const translate = useTranslate();
    const [facebookSettings_object, setFacebookSettings_object] = useState({});
    const [facebookSettings_schema, setFacebookSettings_schema] = useState({});
    const [facebookSettingsInit, setFacebookSettingsInit] = useState("");

    const widgets = {
        CheckboxWidget: CustomCheckbox
      };

    useEffect(() => {
        getFacebookSettings()
            .then(res => {
                if (res.error_message != null) {
                    console.log('Error :>> ', res.error_message);
                    return;
                }
                setFacebookSettings_schema(res.settings_schema);
                setFacebookSettings_object(res.settings_object);
                setFacebookSettingsInit(JSON.stringify(res.settings_object));
            })
            .catch((error) => {
                console.log('Error :>> ', error);
            });

    }, [])

    const transformErrors = (errors) => {
        return errors.map(error => {
            if (error.name === 'pattern') {
                error.message = translate('linkFormat');
            } 
            return error;
        });
    }
    const handleSubmit = (data) => {
        updateFacebookSettings(data.formData)
            .then(res => {
                if (res.error_message != null) {
                    console.log('Error :>> ', res.error_message);
                    return;
                }
                toast.success(translate("changesSavedSuccessfully"));
                setFacebookSettings_object(data.formData);
                setFacebookSettingsInit(JSON.stringify(data.formData));
            })
            .catch((error) => {
                console.log('Error :>> ', error);
                toast.error(translate("errorOccurredWhileSavingTheSettings"));
            });
    }

    return <div>
        <div className="Contacts wrapper">
            <div className="row p-4">
                <div className="col-sm-12 ">
                    {facebookSettings_schema &&
                        facebookSettings_object && (
                            <Form
                                schema={translateJsonSchema(facebookSettings_schema, translate)}
                                formData={facebookSettings_object}
                                transformErrors={transformErrors}
                                liveValidate={true}
                                id="facebook-form"
                                widgets={widgets}
                                onChange={data => setFacebookSettings_object(data.formData)}
                                onSubmit={handleSubmit}
                            >
                                <button
                                    type="submit"
                                    className="btn btn-mint-green btn-sm"
                                    disabled={JSON.stringify(facebookSettings_object) == facebookSettingsInit}
                                >
                                    {translate('saveChanges')}
                                </button>
                            </Form>
                        )}
                </div>
            </div>
        </div>
    </div>
}
export default Facebook;
