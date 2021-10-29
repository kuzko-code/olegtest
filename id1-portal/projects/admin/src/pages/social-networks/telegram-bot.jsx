import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import "../../../public/assets/css/newslist.css";
import "../../../public/assets/css/botsettings.css";
import { getTelegramBotSettings, updateTelegramBotSettings } from "../../services/social_networks-api-services.js";
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { green } from '@material-ui/core/colors';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { linkRegexp } from '../../constants/index.js';
var isEqual = require('lodash/fp/isEqual');

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: '#1ab394',
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

export class BotSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schema: null,
            formData: null,
            initialFormData: null,
            isLinkValid: true
        }
    }

    componentDidMount = () => {
        getTelegramBotSettings().then(res => {
            this.setState({ schema: res.settings_schema, formData: res.settings_object, initialFormData: res.settings_object })
        });
    }

    onSubmit = () => {
        const { translate } = this.props;

        if (!this.validate(this.state.formData)) {
            return;
        }

        updateTelegramBotSettings(this.state.formData)
            .then((res) => {
                this.setState({ initialFormData: this.state.formData })
                toast.success(translate('botSettingsUpdated'));
            })
            .catch((error) => {
                console.log('Error :>> ', error);
                toast.error(translate('botSettingsError'));
            });
    }

    validate = (formData) => {
        if (formData.channel_url.match(linkRegexp)) {
            this.setState({
                isLinkValid: true
            });

            return true;
        } else {
            this.setState({
                isLinkValid: false
            });
            toast.error(this.props.translate('formValidationError'))

            return false;
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState(prevState => ({
            initialFormData: {
                ...prevState.initialFormData
            },
            schema: {
                ...prevState.schema
            },
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }), () => {
            if (isEqual(this.state.formData, this.state.initialFormData)) {
                this.setState({
                    isLinkValid: true
                });
            }
        });
    }

    render() {
        const { translate } = this.props;
        const { schema, formData, initialFormData, isLinkValid } = this.state;

        return (
            <div>

                <div className="p-4 bot-settings">

                    {schema != null ? (
                        <>
                            <div className="d-flex align-items-center checkbox-container">
                                <GreenCheckbox
                                    className="is-bot-enabled"
                                    name="enabled"
                                    id="is-bot-enabled"
                                    onChange={this.handleInputChange}
                                    checked={formData.enabled}
                                />
                                <label for="is-bot-enabled" className="control-label mx-2 mb-0">{translate('botEnableBot')}</label>
                            </div>

                            <label className="control-label" htmlFor="tg-token">{translate('botTelegramToken')}</label>
                            <div className="form-group field field-string">
                                <input className="form-control border-radius-1 shadow-none"
                                    id="tg-token"
                                    name="telegram_token"
                                    type="text"
                                    onChange={this.handleInputChange}
                                    value={formData.telegram_token}
                                />
                            </div>
                            <label className="control-label" htmlFor="tg_channel_id">{translate('botChannelId')}</label>
                            <div className="form-group field field-string">
                                <input className="form-control border-radius-1 shadow-none"
                                    id="tg_channel_id"
                                    name="channel_id"
                                    type="text"
                                    onChange={this.handleInputChange}
                                    value={formData.channel_id}
                                />
                            </div>
                            <label className="control-label" htmlFor="tg_channel_url">{translate('botChannelUrl')}</label>
                            <div className="form-group field field-string">
                                <input className="form-control border-radius-1 shadow-none"
                                    id="tg_channel_url"
                                    name="channel_url"
                                    type="text"
                                    onChange={this.handleInputChange}
                                    value={formData.channel_url}
                                />
                                {!isLinkValid &&
                                    <span className="text-danger">
                                        {translate('linkFormat')}
                                    </span>
                                }
                            </div>
                            <button
                                type="button"
                                className="btn btn-mint-green btn-sm mt-3"
                                disabled={isEqual(formData, initialFormData)}
                                onClick={this.onSubmit}
                            >
                                {translate('saveChanges')}
                            </button>
                        </>
                    ) : null}
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

export default connect(mapStateToProps)(withTranslate(BotSettings));