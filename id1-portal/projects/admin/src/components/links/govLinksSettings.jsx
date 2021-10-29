import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import Form from "react-jsonschema-form";
import { linkRegexp } from '../../constants/index.js';
import { getSettingByTitle, updateSettingsByTitle } from '../../services/index.js';
import { translateJsonSchema, translateUiSchema } from '../../helpers/jsonschema-helpers.js';

class GovLinksSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schema: null,
            formData: null,
            oldData: null,
            uiSchema: null,
            submitDisabled: true,
            isEditorAvailable: true
        };
    }

    componentDidMount() {
        getSettingByTitle('GovSites', this.props.language).then(res => {
            if (res.data) {
                this.setState({ schema: res.data.settings_schema, formData: res.data.settings_object, oldData: res.data.settings_object, uiSchema: res.data.ui_schema })
            } else {
                this.setState({ isEditorAvailable: false })
            }
        });
    }

    onSubmit = (type) => {
        updateSettingsByTitle('GovSites', this.props.language, JSON.stringify(type.formData)).then((res) => {
            if (res.status != "ok") {
                toast.error(this.props.translate('errorOccurredWhileSavingGovLinks'));
                return;
            }
            this.setState({
                oldData: this.state.formData,
                submitDisabled: true
            });
            toast.success(this.props.translate('changesSavedSuccessfully'));
        });
    }

    handleChange = (event) => {
        if (JSON.stringify(this.state.oldData) != JSON.stringify(event.formData)) {
            this.setState({
                formData: event.formData,
                submitDisabled: false
            });
        }
        else if (JSON.stringify(this.state.oldData) === JSON.stringify(event.formData) && event.errors.length > 0) {
            this.setState({
                formData: this.state.oldData,
                submitDisabled: false
            });
        } else {
            this.setState({
                formData: this.state.oldData,
                submitDisabled: true
            });
        }
    }

    render() {
        const { translate } = this.props;
        const { schema, formData, uiSchema, submitDisabled, isEditorAvailable } = this.state;

        if (!isEditorAvailable) return (
            <div>
                <div className="pageElementBox collapsed border-bottom govSettings">
                    <div className="pageElementBoxTitle border-bottom-0 d-flex justify-content-start">
                        <h5>{translate('linksEditorUnaviable')}</h5>
                    </div>
                </div>
            </div>
        );

        const validate = (formData, errors) => {
            let isError = false;

            formData.forEach((item, i) => {
                if (item.url === undefined || item.title === undefined) {
                    errors[i].addError(translate('linkFieldsRequired'));
                } else if (!item.url.match(linkRegexp) || item.title.length > 150) {
                    isError = true
                }
            });

            if (isError) {
                toast.error(translate('formValidationError'));
            }

            return errors;
        };

        const transformErrors = (errors) => {
            return errors.map((error, i) => {
                if (error.name === 'pattern') {
                    error.message = translate('linkFormat');
                } else if (error.name === 'maxLength') {
                    error.message = translate('govLinkTitleTooLong');
                }
                return error;
            });
        }

        return (
            <div>
                <div className="pageElementBox collapsed border-bottom govSettings">
                    {schema != null ? (
                        <div>
                            <div className="pageElementBoxTitle border-bottom-0 d-flex justify-content-between">
                                <h5>
                                    {
                                        translate('govLinks')
                                    }
                                </h5>
                                <button type="submit" className="btn btn-mint-green btn-sm" form="govLinks-form" disabled={submitDisabled}>
                                    {translate('saveChanges')}
                                </button>
                            </div>
                            <div className="pageElementBoxContent" style={{ display: "block" }}>
                                <Form
                                    schema={translateJsonSchema(schema, translate)}
                                    formData={formData}
                                    uiSchema={translateUiSchema(uiSchema, translate)}
                                    onSubmit={this.onSubmit}
                                    validate={validate}
                                    onChange={this.handleChange}
                                    transformErrors={transformErrors}
                                    id="govLinks-form"
                                    className='rjsForm'
                                >
                                    <div>
                                        <button type="submit" className="d-none" />
                                    </div>
                                </Form>
                            </div>
                        </div>
                    ) : (
                            <div className="pageElementBoxTitle border-bottom-0 d-flex justify-content-start">
                                <h5>
                                    {
                                        translate('linksEditorUnaviable')
                                    }
                                </h5>
                            </div>
                        )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(GovLinksSettings));