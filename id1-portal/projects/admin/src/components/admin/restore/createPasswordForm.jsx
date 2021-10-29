import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { updateCode, resetPassword } from '../../../services/auth-api-services';
import { withRouter } from 'react-router';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { translate } from 'react-redux-multilingual/lib/utils';

class CreatePasswordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: this.props.email,
            code: "",
            newPassword: "",
            confirmPassword: "",
            isCodeInvalid: null,
            isNewPasswordInvalid: null,
            isConfirmPasswordInvalid: null,
        }
        this.handleCodeResend = this.handleCodeResend.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    codeInputRef = React.createRef();
    newPasswordInputRef = React.createRef();
    confirmPasswordInputRef = React.createRef();

    handleChange(ref, type) {
        this.setState({ [type]: ref.current.value })
    }

    handleSubmit(event) {
        event.preventDefault()
        const { code, newPassword, confirmPassword } = this.state
        if (confirmPassword != newPassword) {
            this.setState({
                isConfirmPasswordInvalid: true,
                isCodeInvalid: false,
                isNewPasswordInvalid: false
            })
            return;
        } else {
            const { translate, language, email } = this.props
            resetPassword(JSON.stringify({ code: code.trim(), password: newPassword, email: email, language: language })).then((data) => {
                let validationVar = {
                    isCodeInvalid: false,
                    isNewPasswordInvalid: false
                }
                if (data.error_message === null) {
                    const { history } = this.props
                    Swal.fire({
                        title: translate('successRestoreAlertTitle'),
                        text: " ",
                        icon: 'success',
                        confirmButtonText: 'Ок',
                        allowOutsideClick: false
                    }).then((result => {
                        if (result.value) {
                            history.push(`/${language}`)
                        }
                    }))
                } else {
                    if (data.error_message.search("code") != -1) {
                        validationVar.isCodeInvalid = true
                    }
                    if (data.error_message.search("password") != -1) {
                        validationVar.isNewPasswordInvalid = true
                    }
                    this.setState({
                        isCodeInvalid: validationVar.isCodeInvalid,
                        isNewPasswordInvalid: validationVar.isNewPasswordInvalid,
                        isConfirmPasswordInvalid: false

                    })
                }
            })

        }

    }
    handleCodeResend() {
        const { language, email,translate } = this.props

        updateCode(JSON.stringify({ email: email, language: language }))
        Swal.fire({
            title:translate("codeResended"),
            text: " ",
            icon: 'success',
            confirmButtonText: 'Ок',
            allowOutsideClick: true
        })

    }
    render() {
        document.body.classList.add("adminLoginPage")
        const {
            isCodeInvalid,
            isNewPasswordInvalid,
            isConfirmPasswordInvalid
        } = this.state
        const { translate, language } = this.props

        return (
            <div className="adminRestore">
                <div className="auth-box text-center animated fadeInDown">
                    <div className="restoreForm">
                        <div className="restoreTitle">
                            <h3 className="font-bold">{translate('passwordRestore')}</h3>
                            <p className="text-center">
                                {translate('enterCodeAndPassword')}
                            </p>
                        </div>
                        <div className="row">

                            <div className="col-lg-12">
                                <form className="m-t-15" role="form">
                                    <div className="form-group">
                                        <input
                                            id="code"
                                            type="text"
                                            placeholder={translate("code")}
                                            ref={this.codeInputRef}
                                            autoComplete="off"
                                            className="form-control border-radius-1 shadow-none"
                                            onChange={() => this.handleChange(this.codeInputRef, "code")}
                                        />
                                        {isCodeInvalid &&
                                            <span className="adminValidSpan">{translate("invalidCode")}</span>
                                        }
                                    </div>
                                    <div className="form-group">
                                        <input
                                            id="password"
                                            type="password"
                                            ref={this.newPasswordInputRef}
                                            placeholder={translate('newPassword')}
                                            autoComplete="new-password"
                                            className="form-control border-radius-1 shadow-none pl-3"
                                            onChange={() => this.handleChange(this.newPasswordInputRef, "newPassword")}
                                        />
                                        {isNewPasswordInvalid &&
                                            <span className="adminValidSpan">{translate('passwordRequirements')}</span>
                                        }
                                    </div>
                                    <div className="form-group">
                                        <input
                                            id="sumbitPassword"
                                            ref={this.confirmPasswordInputRef}
                                            type="password"
                                            placeholder={translate('retypePassword')}
                                            autoComplete="new-password"
                                            className="form-control border-radius-1 shadow-none"
                                            onChange={() => this.handleChange(this.confirmPasswordInputRef, "confirmPassword")}
                                        />
                                        {isConfirmPasswordInvalid &&
                                            <span className="adminValidSpan">{translate('passwordsDoNotMatch')}</span>
                                        }
                                    </div>

                                    <button onClick={this.handleSubmit} id="submitNewPassword" type="submit" className="btn btn-mint-green d-block w-100 m-b-15">{translate('send')}</button>
                                    <button onClick={this.handleCodeResend} id="resendCode" type="button" className="btn btn-primary d-block w-100 m-b-15">{translate("resendCode")}</button>
                                    <Link to={`/${this.props.language}/login`}>{translate('goToTheLoginPage')}</Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};
export default withRouter(connect(mapStateToProps)(withTranslate(CreatePasswordForm)))