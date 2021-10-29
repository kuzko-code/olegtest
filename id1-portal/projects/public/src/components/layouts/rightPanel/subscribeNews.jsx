import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { postNewsSubscription } from '../../../services';
import { REGULAR_EXPRESSIONS } from '../../../../config/index.jsx';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import TabHeader from '../../main/tabHeader.jsx';

class SubscribeNews extends Component {
  state = {
    token: '',
    error: '',
    isSaved: false,
    showCaptcha: false
  };
  captchaRef = React.createRef(null);
  formRef = React.createRef(null);

  setToken = (token) => this.setState({ token });

  setError = (error) => this.setState({ error });

  handleCaptchaChange = (value) => {
    const email = this.formRef.current.email.value;

    if (!email.match(REGULAR_EXPRESSIONS.EMAIL)) {
      this.captchaRef.current.reset();
      this.setToken('');
      console.error('Error while subscribing news :>> ', "emailFormatError");
      this.setError('emailFormatError');
      return;
    }

    const body = {
      email,
      language: this.props.language,
      token: value,
    };
    postNewsSubscription(body)
      .then(({ status, error_message }) => {
        if (status === 'error') {
          this.captchaRef.current.reset();
          this.setToken('');
          throw error_message;
        }
        this.setToken('');
        this.setError('');
        this.captchaRef.current.reset();
        this.formRef.current.reset();
        this.setState({ isSaved: true });
        setTimeout(() => {
          this.setState({ isSaved: false, showCaptcha: false });
        }, 7000);
      })
      .catch(error => {
        console.log('Error while subscribing news :>> ', error);
        this.setError(error);
      })
  }

  handleTokenExpired = () => {
    this.setToken('');
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ showCaptcha: true })
  };

  render() {
    const { translate } = this.props;

    return (
      <div className="ts-newsletter">
        <div className="newsletter-introtext">
          <TabHeader title={translate('digestNews')} />
          {!this.state.isSaved &&
            <p>
              <span>{translate('subscribeNewsletterEmail')}</span>
            </p>}
        </div>
        <div className="newsletter-form d-flex">
          {this.state.isSaved ? (
            <div className="subscribeNews__successMessageWrapper">
              <div className="sa">
                <div className="sa-success">
                  <div className="sa-success-tip"></div>
                  <div className="sa-success-long"></div>
                  <div className="sa-success-placeholder"></div>
                  <div className="sa-success-fix"></div>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={this.handleSubmit}
              ref={this.formRef}
              className="subscribeNews__form"
            >
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  className="form-control form-control-lg"
                  autoComplete="off"
                  required
                />
                {this.state.error && (
                  <span className="authModal__formErrorMessage">
                    {translate(this.state.error)}
                  </span>
                )}
              </div>
              {this.state.showCaptcha && <ReCAPTCHA
                ref={this.captchaRef}
                sitekey={process.env.CAPTCHA_KEY}
                onChange={this.handleCaptchaChange}
                onExpired={this.handleTokenExpired}
              />}
              {!this.state.showCaptcha && <button
                type="submit"
                className="button-digital"
              >
                <span>{translate('subscribe')}</span>
              </button>}
            </form>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.Intl.locale,
    themeColor: state.reducerSettings.Layout.selectedColorTheme[2],
  };
};

export default connect(mapStateToProps)(withTranslate(SubscribeNews));
