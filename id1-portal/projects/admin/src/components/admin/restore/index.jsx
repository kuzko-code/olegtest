import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import { withRouter } from 'react-router';
import { updateCode } from '../../../services/auth-api-services.js';
import { connect } from 'react-redux';
import { REGULAR_EXPRESSIONS } from '../../../../config/index.jsx';

export class Restore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEmailValid: true,
            redirect: false,
            email: '',
            showModal: false,
        }
        this.validateForm = this.validateForm.bind(this);
        this.setRedirectTrue = this.setRedirectTrue.bind(this);
    }

    setInputRef = r => { this.emailInput = r; }
    validateForm = e => {
        e.preventDefault();

        const isEmailValid = REGULAR_EXPRESSIONS.EMAIL.test(this.emailInput.value)
        const { translate, language, history,onEmailSubmit} = this.props;
        const email = this.state.email;
        this.setState({ isEmailValid })
        if (!isEmailValid) e.preventDefault()
        else {
            updateCode(JSON.stringify({ email: email, language: this.props.language })).then(data => {
                if (data.error_message === null) {
                    onEmailSubmit(email)
                    history.push(`/${language}/createPassword`)
                }
                else {
                    let errorMessage=translate("errorRestoreAlertTitle");
                    if(data.error_message==="User is not defined"){
                        errorMessage=translate("errorUserMissing")
                    }
                    Swal.fire({
                        title: errorMessage,
                        text: translate('errorRestoreAlertText'),
                        icon: 'error',
                        confirmButtonText: 'Ок',
                        allowOutsideClick: false
                    });
                }
            }
            );
        }
    }

    setRedirectTrue() {
        this.setState({ redirect: true })
    }

    onEmailChange = e => this.setState({ email: e.target.value })

    render() {
        const { translate } = this.props;
        const { redirect } = this.state;
        const { isEmailValid } = this.state
        document.body.classList.add("adminRestorePage")
        if (redirect) {
            this.setState({ redirect: false });
            document.body.classList.remove("adminRestorePage")
            window.location.href = '/' + this.props.language;

        }
        return (
            <div className="adminRestore">
                <div className="auth-box text-center animated fadeInDown">
                    <div className="restoreForm">
                        <div className="restoreTitle">
                            <h3 className="font-bold">{translate('passwordRestore')}</h3>
                            <p className="text-center">
                                {translate('codeWillBeEmailed')}
                            </p>
                        </div>
                        <div className="row">

                            <div className="col-lg-12">
                                <form className="m-t-15" role="form">
                                    <div className="form-group">
                                        <input
                                            id="email"
                                            type="email"
                                            onChange={this.onEmailChange}
                                            ref={this.setInputRef}
                                            className={["form-control border-radius-1 shadow-none", isEmailValid ? '' : 'errorInput'].join(' ')}
                                            placeholder={translate('email')}
                                            required=""
                                        ></input>
                                        {!isEmailValid &&
                                            <span className="adminValidSpan">{translate('invalidEmailFormat')}</span>
                                        }
                                    </div>

                                    <button onClick={this.validateForm} id="submitButton" type="submit" className="btn btn-mint-green d-block w-100 m-b-15">{translate('send')}</button>
                                    <Link to={`/${this.props.language}/login`}>{translate('goToTheLoginPage')}</Link>
                                </form>
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
        language: state.Intl.locale
    };
};

export default withRouter(connect(mapStateToProps)(withTranslate(Restore)));