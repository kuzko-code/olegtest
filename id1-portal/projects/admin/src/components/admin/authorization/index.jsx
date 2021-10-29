import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import "../../../../public/css/plugins/iCheck/custom.css"
import { Link } from 'react-router-dom';
import { postLogin } from '../../../services/auth-api-services.js';
import { connect } from 'react-redux';
import { REGULAR_EXPRESSIONS } from '../../../../config/index.jsx';
export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEmailEmpty: false,
            isEmailValid: true,
            isPassEmpty: false,
            shouldRememberMe: false,
            redirect: false,
            email: '',
            password: '',
            isLoginCorrect: true,
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    validateEmail = email => {
        return REGULAR_EXPRESSIONS.EMAIL.test(email)
    }

    toggleRememberMe = () => this.setState({ shouldRememberMe: !this.state.shouldRememberMe })
    onEmailChange = e => this.setState({ email: e.target.value })
    onPasswordChange = e => this.setState({ password: e.target.value })
    isEmpty = x => x === ''
    onSubmit = e => {
        e.preventDefault()
        const emailValue = this.emailField.value
        const passValue = this.passField.value
        const isEmailEmpty = this.isEmpty(emailValue)
        const isEmailValid = this.validateEmail(emailValue)
        const isPassEmpty = this.isEmpty(passValue)

        this.setState({ isEmailEmpty, isEmailValid, isPassEmpty })

        if (isEmailEmpty || !isEmailValid || isPassEmpty) {
            e.preventDefault()
        }
        else {
            const email = this.state.email;
            const password = this.state.password;
            const login = postLogin({ email: email, password: password }).then(data => {
                if (data.error_message === null) {
                    localStorage.setItem("token", `Bearer ${data.data.token}`)
                    this.setState({ redirect: true })
                    this.setState({ isLoginCorrect: true })
                }
                else {
                    this.setState({ isLoginCorrect: false })
                }
            })
        }
    }

    setEmailField = r => this.emailField = r
    setPassField = r => this.passField = r
    buildClassName = (...xs) => xs.filter(x => !!x).join(' ')

    render() {
        const { redirect } = this.state;
        const { translate } = this.props;
        const { isEmailValid, isEmailEmpty, isPassEmpty, shouldRememberMe, isLoginCorrect } = this.state
        const emailClassName = this.buildClassName('form-control border-radius-1 shadow-none', (isEmailEmpty || !isEmailValid) && 'errorInput')
        const passClassName = this.buildClassName('form-control border-radius-1 shadow-none', isPassEmpty && 'errorInput')
        document.body.classList.add("adminLoginPage")
        const rememberMeClassName = this.buildClassName('icheckbox_square-green', shouldRememberMe && 'checked')
        if (redirect) {
            this.setState({ redirect: false });
            document.body.classList.remove("adminLoginPage");
            window.location.href = '/' + this.props.language;
        }
        return (
            <div className="adminLogin">
                <div className="auth-box text-center animated fadeInDown">
                    <div className="loginForm">
                        <div>
                            <h3 className="authTitle">{translate('welcome')} !</h3>
                        </div>
                        <p className="authTitle">{translate('enterYourCredentialsToLogIn')}</p>
                        {!isEmailEmpty && !isPassEmpty && !isLoginCorrect &&
                            <span className="adminValidSpan">{translate('invalidEmailOrPassword')}</span>
                        }
                        <form className="m-t-15" role="form">
                            <div className="form-group">
                                <input type="email" ref={this.setEmailField} className={emailClassName} placeholder={translate('login')} required="" onChange={this.onEmailChange}></input>
                                {isEmailEmpty &&
                                    <div>
                                        <span className="adminValidSpan">{translate('emailIsRequired')}</span>
                                        <br></br>
                                    </div>
                                }
                                {!isEmailEmpty && !isEmailValid &&
                                    <span className="adminValidSpan">{translate('invalidEmailFormat')}</span>
                                }
                            </div>
                            <div className="form-group">
                                <input type="password" ref={this.setPassField} className={passClassName} placeholder={translate('password')} required="" onChange={this.onPasswordChange}></input>
                                {isPassEmpty &&
                                    <span className="adminValidSpan">{translate('passwordIsRequired')}</span>
                                }
                            </div>
                            <div className="checkbox i-checks">
                                {/* <label>
                                    <div id="CheckBoxDiv" className={rememberMeClassName} style={{ position: "relative" }}>
                                        <input type="checkbox" onChange={this.toggleRememberMe} checked={shouldRememberMe} style={{ position: "absolute", opacity: 0, }}>

                                        </input>
                                        <ins className="iCheck-helper" style={{ position: "absolute", top: "0%", left: "0%", display: "block", width: "100%", height: "100%", margin: "0px", padding: "0px", background: "rgb(255, 255, 255)", border: "0px", opacity: "0", }}></ins>
                                    </div>
                                    <i></i> {translate('rememberMe')}
                                </label> */}
                            </div>
                            <button type="submit" onClick={this.onSubmit} className="btn btn-mint-green d-block w-100 m-b-15">{translate('signIn')}</button>

                            <Link to={`/${this.props.language}/restore`}>{translate('forgotPassword')}?</Link>
                        </form>
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

// export default MainPage;
export default connect(mapStateToProps)(withTranslate(Login));