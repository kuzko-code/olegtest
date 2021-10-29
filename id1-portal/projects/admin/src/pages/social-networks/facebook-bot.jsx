import React, { useEffect, useState } from 'react';
import Form from 'react-jsonschema-form';
import { toast } from 'react-toastify';
import { getFacebookBotSettings, updateFacebookBotSettings } from "../../services/social_networks-api-services.js";
import { translateJsonSchema } from "../../helpers/jsonschema-helpers.js";
import { useTranslate } from 'react-redux-multilingual';
import { useSelector } from 'react-redux';
import { CustomCheckbox } from '../../components/ui/customRjsf.js';
import { getRubrics } from '../../services/rubric-api-services.js';

const Facebook = (props) => {
    const translate = useTranslate();
    const language = useSelector((state) => state.Intl.locale);
    const [facebookSettings_object, setFacebookSettings_object] = useState({});
    const [facebookSettings_schema, setFacebookSettings_schema] = useState({});
    const [facebookSettings_ui, setFacebookSettings_ui] = useState({});
    const [facebookSettingsInit, setFacebookSettingsInit] = useState("");

    const widgets = {
        CheckboxWidget: CustomCheckbox
    };

    useEffect(() => {
        Promise.all([
            getFacebookBotSettings(),
            getRubrics(language)
        ])
            .then(([facebook_settings, rubric]) => {
                facebook_settings.settings_schema.definitions.rubrics.anyOf = [...rubric.data, { id: 0, title: translate('withoutRubrics') }].map(r =>
                ({
                    type: "number",
                    enum: [r.id],
                    title: r.title,
                    default: 0
                }));
                setFacebookSettings_schema(facebook_settings.settings_schema);
                setFacebookSettings_object(facebook_settings.settings_object);
                setFacebookSettings_ui(facebook_settings.ui_schema);
                setFacebookSettingsInit(JSON.stringify(facebook_settings.settings_object));
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
        updateFacebookBotSettings(data.formData)
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
                                schema={translateJsonSchema(facebookSettings_schema, translate, ['description'])}
                                uiSchema={facebookSettings_ui}
                                formData={facebookSettings_object}
                                transformErrors={transformErrors}
                                liveValidate={true}
                                id="facebook-form"
                                widgets={widgets}
                                onChange={data => setFacebookSettings_object(data.formData)}
                                onSubmit={handleSubmit}
                                showErrorList={false}
                            >
                                <button
                                    type="submit"
                                    className="btn btn-mint-green btn-sm mt-3"
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
