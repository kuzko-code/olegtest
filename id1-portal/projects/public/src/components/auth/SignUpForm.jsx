import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import CloseIcon from '@material-ui/icons/Close';
import ReCAPTCHA from 'react-google-recaptcha';

import { signUp } from '../../services/auth-api-service.js';
import { REGULAR_EXPRESSIONS } from '../../../config/index.jsx';
import actions from '../../redux/general/generalActions';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const defaultValues = {
  first_name: '',
  last_name: '',
  patronymic: '',
  email: '',
  password: '',
  passwordRepeat: '',
  token: '',
};

const SignUpForm = ({ setModalMode, translate, setEmail }) => {
  const dispatch = useDispatch();
  const captchaRef = useRef(null);
  const language = useSelector(({ Intl }) => Intl.locale);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({ defaultValues, shouldFocusError: true, mode: 'onChange' });
  const token = watch('token');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseAuthModal = () => dispatch(actions.setAuthModalShownFalse());

  const handleCaptchaChange = (value) => value && setValue('token', value);

  const handleTokenExpired = () => setValue('token', '');

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    if (data.password !== data.passwordRepeat) {
      setError('passwordRepeat', {
        type: 'match',
      });
      return;
    }

    const body = Object.assign({}, data);
    delete body.passwordRepeat;
    body.language = language;

    try {
      setIsLoading(true);
      await signUp(body);

      setEmail(data.email);
      setModalMode('confirmPasswordSignUp');
    } catch (error) {
      console.error('Error while registration:>> ', error);

      setValue('token', '');
      captchaRef.current.reset();

      if (error.message.includes('Exceeded limit')) {
        setError('token', {
          type: 'reportLimit',
        });
      }

      if (error.message.includes('Recaptcha validation failed')) {
        setError('token', {
          type: 'captchaExpired',
        });
      }

      error.message.includes('duplicate key value') &&
        setError('email', {
          type: 'duplicateError',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="border-bottom d-flex justify-content-between p-4">
        <h5 className="mb-0">{translate('registration')}</h5>
        <button
          type="button"
          onClick={handleCloseAuthModal}
          className="authModal__textBtn authModal__textBtn-colorGrey"
        >
          <CloseIcon />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <label className="authModal__label mb-2">
          {translate('lastName')}
          <input
            {...register('last_name', { required: true, maxLength: 100 })}
            className="authModal__input"
          />
          {errors.last_name && errors.last_name.type === 'required' && (
            <span className="authModal__formErrorMessage">
              {translate('fieldRequired')}
            </span>
          )}
          {errors.last_name && errors.last_name.type === 'maxLength' && (
            <span className="authModal__formErrorMessage">
              {translate('inputLength100Error')}
            </span>
          )}
        </label>
        <label className="authModal__label mb-2">
          {translate('firstName')}
          <input
            {...register('first_name', { required: true, maxLength: 100 })}
            className="authModal__input"
          />
          {errors.first_name && errors.first_name.type === 'required' && (
            <span className="authModal__formErrorMessage">
              {translate('fieldRequired')}
            </span>
          )}
          {errors.first_name && errors.first_name.type === 'maxLength' && (
            <span className="authModal__formErrorMessage">
              {translate('inputLength100Error')}
            </span>
          )}
        </label>
        <label className="authModal__label mb-2">
          {translate('patronymic')}
          <input
            {...register('patronymic', { maxLength: 100 })}
            className="authModal__input"
          />
          {errors.patronymic && errors.patronymic.type === 'maxLength' && (
            <span className="authModal__formErrorMessage">
              {translate('inputLength100Error')}
            </span>
          )}
        </label>
        <label className="authModal__label mb-2">
          {translate('email')}
          <input
            {...register('email', {
              required: true,
              pattern: REGULAR_EXPRESSIONS.EMAIL,
            })}
            className="authModal__input"
          />
          {errors.email && errors.email.type === 'required' && (
            <span className="authModal__formErrorMessage">
              {translate('fieldRequired')}
            </span>
          )}
          {errors.email && errors.email.type === 'pattern' && (
            <span className="authModal__formErrorMessage">
              {translate('emailFormatError')}
            </span>
          )}
          {errors.email && errors.email.type === 'duplicateError' && (
            <span className="authModal__formErrorMessage">
              {translate('emailDuplicatetError')}
            </span>
          )}
        </label>
        <label className="authModal__label mb-2">
          {translate('password')}
          <OutlinedInput
            fullWidth={true}
            inputProps={{
              ...register('password', {
                required: true,
                pattern: REGULAR_EXPRESSIONS.SIGN_IN_PASSWORD,
              })
            }}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.password && errors.password.type === 'required' && (
            <span className="authModal__formErrorMessage">
              {translate('fieldRequired')}
            </span>
          )}
          {errors.password && errors.password.type === 'pattern' && (
            <span className="authModal__formErrorMessage">
              {translate('passwordFormatError')}
            </span>
          )}
        </label>
        <label className="authModal__label mb-2">
          {translate('confirmPassword')}
          <OutlinedInput
            fullWidth={true}
            inputProps={{ ...register('passwordRepeat', { required: true }) }}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.passwordRepeat &&
            errors.passwordRepeat.type === 'required' && (
              <span className="authModal__formErrorMessage">
                {translate('fieldRequired')}
              </span>
            )}
          {errors.passwordRepeat && errors.passwordRepeat.type === 'match' && (
            <span className="authModal__formErrorMessage">
              {translate('passwordConfirmationError')}
            </span>
          )}
        </label>
        <ReCAPTCHA
          ref={captchaRef}
          sitekey={process.env.CAPTCHA_KEY}
          onChange={handleCaptchaChange}
          onExpired={handleTokenExpired}
          className="authModal__captchaWrapper mb-2"
        />
        {errors.token && errors.token.type === 'reportLimit' && (
          <span className="authModal__formErrorMessage d-block mb-2">
            {translate('reportLimitAlert')}
          </span>
        )}
        {errors.token && errors.token.type === 'captchaExpired' && (
          <span className="authModal__formErrorMessage d-block mb-2">
            {translate('captchaExpired')}
          </span>
        )}
        <button
          type="submit"
          className="authModal__submitBtn mb-2"
          disabled={isLoading || !token}
        >
          {isLoading ? (
            <div className="spinner-border text-color" />
          ) : (
            translate('signUp')
          )}
        </button>
      </form>
    </>
  );
};

export default withTranslate(SignUpForm);
