import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
//services
import { getUserByToken, putUser } from '../../services/user-api-services.js';
import { changePassword } from '../../services/auth-api-services.js';
import { toast } from 'react-toastify';
import { REGULAR_EXPRESSIONS } from "../../../config/index.jsx"
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index.js';
import SectionHeader from '../header/SectionHeader.jsx';

class Profile extends Component {
    state = {
        userId: null,
        username: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        passwordChanged: false,
        initialUsername: "",
        initialEmail: ""
    }
    componentDidMount() {
        Promise.all([getUserByToken()]).then(resonses => {
            this.setState({
                email: resonses[0].data.email,
                username: resonses[0].data.userName,
                initialEmail: resonses[0].data.email,
                initialUsername: resonses[0].data.userName,
                userId: resonses[0].data.userId
            })
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { translate } = this.props;
        const { userId, username, email, oldPassword, newPassword, confirmPassword, passwordChanged, initialEmail, initialUsername } = this.state;
        const userNewData =
        {
            id: userId,
            email: email.trim(),
            username: username.trim()
        }

        if (!this.isUserValidated(userNewData)) return;

        if (passwordChanged) {
            if (oldPassword.length === 0 || newPassword.length === 0 || confirmPassword.length === 0) {
                toast.error(translate('allPasswordChangeFieldsAreRequired'));
            }
            else if (newPassword !== confirmPassword) {
                toast.error(translate('passwordsDoNotMatch'));
            }
            else {
                changePassword({ oldPassword: oldPassword, newPassword: newPassword }).then(data => {
                    if (data.error_message === null) {
                        this.updateUserLoginName(userNewData);
                        this.resetInputValuePassword();
                    }
                    else if (data.error_message === "The 'newPassword' field fails to match the required pattern!") {
                        toast.error(translate('passwordRequirements'), { autoClose: 10000 })
                    }
                    else if (data.error_message === "Invalid old password.") {
                        toast.error(translate('invalidOldPassword'), { autoClose: 10000 })
                    }
                    else {
                        toast.error(translate('invalidDataEntered'))
                    }
                })
            }
        }
        else {
            this.updateUserLoginName(userNewData);
        }
    }
    updateUserLoginName = (userNewData) => {
        const { translate } = this.props;
        putUser(JSON.stringify(userNewData)).then(data => {
            if (data.status == "ok") {
                this.setState({ initialEmail: userNewData.email, initialUsername: userNewData.username })
                this.props.UpdateUser(userNewData.username);
                toast.success(translate('changesSavedSuccessfully'))
            } else {
                if (data.error_message == 'duplicate key value violates unique constraint "u_email"') {
                    toast.error(translate("errorduplicateEmail"))
                } else {
                    toast.error(translate("errorOccurredWhileUpdatingTheUser"))
                }
                this.setState(({ initialEmail, initialUsername }) => {
                    return { email: initialEmail, username: initialUsername }
                });
            }
        })
    }
    resetInputValuePassword = () => {
        this.setState({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            passwordChanged: false
        });
    }
    isUserValidated = (User) => {
        const { translate } = this.props;
        let errorMessage = [];

        if (User.username.trim().length === 0) {
            errorMessage.push(translate('userFieldIsRequired'));
        }
        if (User.email.search(REGULAR_EXPRESSIONS.EMAIL) === -1) {
            errorMessage.push(translate('enterAnExistingEmail'));
        }
        if (errorMessage.length > 0) {
            errorMessage.map((mes) => toast.error(mes));
            return false;
        }
        return true;
    }
    handleFieldChange = (evt) => {
        const value = evt.target.value.trimStart();
        this.setState({
            [evt.target.name]: value,
        });
    }
    handlePasswordChange = (evt) => {
        const value = evt.target.value;
        this.setState({
            [evt.target.name]: value,
            passwordChanged: value.length !== 0
        });
    }
    render() {
        const { translate } = this.props;
        const { username, email, oldPassword, newPassword, confirmPassword, initialEmail, initialUsername, passwordChanged } = this.state;

        return (
            <div>
                <SectionHeader
                    isSticky={true}
                    title={translate('editProfile')}
                    isCancelSubmitShown={true}
                    isCancelShown={false}
                    handleSubmit={this.onSubmit}
                    submitDisable={initialEmail === email.trim() && initialUsername === username.trim() && !passwordChanged}
                />
                <div className="Contacts wrapper wrapperContent animated fadeInRight">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="container bg-white left1px ">
                                <div className="p-4">
                                    <form className="rjsf" id="profileChangeForm">
                                        <div className="form-group field field-object">
                                            <fieldset id="root" form="profileChangeForm">
                                                <legend id="root__title">{translate('profile')}</legend>
                                                <div className="form-group field field-string">
                                                    <label className="control-label" htmlFor="root_username">{translate('user')}</label>
                                                    <input required className="form-control border-radius-1 shadow-none" onChange={this.handleFieldChange} name="username" type="text" value={username}></input>
                                                </div>
                                                <div className="form-group field field-string">
                                                    <label className="control-label" htmlFor="root_email">{translate('login')}</label>
                                                    <input required className="form-control border-radius-1 shadow-none" onChange={this.handleFieldChange} name="email" type="email" value={email}></input>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="container bg-white left1px ">
                                <div className="passwordLine"></div>
                                <div className="p-4">
                                    <fieldset form="profileChangeForm">
                                        <div className="form-group field field-string">
                                            <label className="control-label" htmlFor="root_oldPassword">{translate('currentPassword')}</label>
                                            <input className="form-control border-radius-1 shadow-none" name="oldPassword" value={oldPassword} type="password" onChange={this.handlePasswordChange}></input>
                                        </div>
                                        <div className="form-group field field-string">
                                            <label className="control-label" htmlFor="root_newPassword">{translate('newPassword')}</label>
                                            <input className="form-control border-radius-1 shadow-none" name="newPassword" value={newPassword} type="password" onChange={this.handlePasswordChange}></input>
                                        </div>
                                        <div className="form-group field field-string">
                                            <label className="control-label" htmlFor="root_confirmPassword">{translate('retypePassword')}</label>
                                            <input className="form-control border-radius-1 shadow-none" name="confirmPassword" value={confirmPassword} autoComplete="new-password" type="password" onChange={this.handlePasswordChange}></input>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reduxState: state
    };
};

export default connect(mapStateToProps, actions)(withTranslate(Profile));
