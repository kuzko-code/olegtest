import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import Form from "react-jsonschema-form";
import { translateJsonSchema, translateUiSchema, } from '../../helpers/jsonschema-helpers.js';
import ApiService from '../../helpers/api-helpers.js';
import SectionHeader from '../header/SectionHeader.jsx';
import CircularProgress from '@material-ui/core/CircularProgress';

const api = new ApiService('/settings', localStorage.getItem('token'));

class smtpSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            settings_schema: null,
            ui_schema: null,
            settings_object: null,
            isLoading: true,
        }
    }

    componentDidMount() {

        api.getAllItems({
            titles: "smtp"
        }).then(res => {
            let settings_schema = res[0].settings_schema
            settings_schema.title = ""
            this.setState({
                settings_schema: settings_schema,
                ui_schema: res[0].ui_schema,
                settings_object: res[0].settings_object,
                isLoading: false
            })
        })
    }
    transformErrors = (errors) => {
        const {translate}=this.props
        const res=errors.map((error) => {
            if (
                (error.name === 'type' && error.message === 'should be string') ||
                error.name === 'required'
            ) {
                error.message = translate('shouldBeString');
            }
            if(error.name==="maximum" && error.message==="should be <= 65535")
            {
                error.message=translate("wrongRangeSmtpError")
            }
            if(error.name==="format" && error.params.format==="email"){
                error.message=translate("invalidEmailFormat")

            }
            return error;
        });
        return res;
    };
    handleSubmit = () => {
        const {settings_object}=this.state
        api.updateItem({
            settings:
                [{
                    title: "smtp",
                    settings_object: settings_object
                }]
        }).then(() => {
            toast.success(this.props.translate("changesSavedSuccessfully"))
        })
    }
    render() {
        const { settings_object, settings_schema, ui_schema, isLoading } = this.state
        const { translate } = this.props
        return (
            <div>
                <SectionHeader
                    title={translate("mailServer")}
                    handleSubmit={() => document.getElementById('smtp-settings-submit-button').click()}
                    isCancelSubmitShown={true}
                    isCancelShown={false}
                />
                {isLoading ? <div className="text-center">
                    <CircularProgress
                        className={'m-3'}
                        style={{ color: '#19aa8d' }}
                    />
                </div> :
                    <div className="wrapperContent">
                        <div className="col-sm-10">
                            <div className="pageElementBox border-bottom">
                                <div className="pageElementBoxTitle border-bottom-0">
                                    <h5>{translate("smtpSettings")}</h5>
                                </div>
                                <div className="pageElementBoxContent">
                                    <div className="col-md-12 col-lg-10 col-xl-8">
                                        <Form
                                            id="smtp-settings-json-form"
                                            autocomplete="off"
                                            schema={translateJsonSchema(settings_schema, translate)}
                                            uiSchema={translateUiSchema(ui_schema, translate)}
                                            transformErrors={this.transformErrors}
                                            liveValidate={true}
                                            formData={settings_object}
                                            onChange={(data) => {
                                                this.setState({ settings_object: data.formData })
                                            }}
                                            showErrorList={false}
                                            onSubmit={this.handleSubmit}
                                        >
                                            <button type="submit" id="smtp-settings-submit-button" className="d-none"></button>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(smtpSettings));