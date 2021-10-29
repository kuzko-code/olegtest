import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import CloseIcon from '@material-ui/icons/Close';

import { confirmPassword, resetPassword, updateCode } from '../../services/auth-api-service.js';
import { withRouter } from 'react-router-dom';
import { REGULAR_EXPRESSIONS } from '../../../config/index.jsx';
import actions from '../../redux/general/generalActions';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { setBearerToken } from '../../services/auth-service.js'

const defaultValues = {
  code: '',
  password: '',
  passwordRepeat: '',
};

const ConfirmPasswordForm = ({ modalMode, email, translate, history }) => {
  const language = useSelector(({ Intl }) => Intl.locale);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues, shouldFocusError: true });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseAuthModal = () => dispatch(actions.setAuthModalShownFalse());

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async ({ code, password, passwordRepeat }) => {
    if (modalMode === 'confirmPasswordRestore' && password !== passwordRepeat) {
      setError('passwordRepeat', {
        type: 'match',
      });
      return;
    }

    const body = {
      email,
      code: code.trim(),
      password,
      language,
    };

    modalMode === 'confirmPasswordSignUp' && delete body.password;

    try {
      setIsLoading(true);
      let promise = null;
      if (modalMode === 'confirmPasswordRestore') {
        promise = resetPassword;
      } else {
        promise = confirmPassword;
      }
      const { token } = await promise(body);
      setBearerToken(token);
      history.push(`/${language}/myaccount`);
      handleCloseAuthModal();
    } catch (error) {
      error.message.includes('Invalid code') &&
        setError('code', {
          type: 'credentialError',
        });
      error.message.includes('Activation Limit Exceeded') &&
        setError('code', {
          type: 'activationLimit',
        });

      console.log('Error while confirming the code:>> ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      await updateCode({ email, language });
    } catch (error) {
      console.log('Error while updating code:>> ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="border-bottom d-flex justify-content-between p-4">
        <h5 className="mb-0">
          {modalMode === 'confirmPasswordRestore' &&
            translate('passwordRecovery')}
          {modalMode === 'confirmPasswordSignUp' &&
            translate('registerConfirmation')}
        </h5>
        <button
          type="button"
          onClick={handleCloseAuthModal}
          className="authModal__textBtn authModal__textBtn-colorGrey"
        >
          <CloseIcon />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <p className="authModal__recoveryDescription mb-4">
          {modalMode === 'confirmPasswordRestore' &&
            translate('passwordConfirmDescription')}
          {modalMode === 'confirmPasswordSignUp' &&
            translate('signUpConfirmDescription')}
        </p>
        <label className="authModal__label mb-3">
          {modalMode === 'confirmPasswordRestore' && translate('recoveryCode')}
          {modalMode === 'confirmPasswordSignUp' &&
            translate('confirmationCode')}
          <input
            type={'text'}
            {...register('code', {
              required: true,
              pattern: REGULAR_EXPRESSIONS.CONFIRMATION_CODE,
            })}
            className="authModal__input"
          />
          {errors.code && errors.code.type === 'required' && (
            <span className="authModal__formErrorMessage">
              {translate('fieldRequired')}
            </span>
          )}
          {errors.code && errors.code.type === 'pattern' && (
            <span className="authModal__formErrorMessage">
              {translate('codeFormatError')}
            </span>
          )}
          {errors.code && errors.code.type === 'credentialError' && (
            <span className="authModal__formErrorMessage">
              {translate('codeCredentialError')}
            </span>
          )}
          {errors.code && errors.code.type === 'activationLimit' && (
            <span className="authModal__formErrorMessage">
              {translate('activationLimitExceeded')}
            </span>
          )}
        </label>
        {modalMode === 'confirmPasswordRestore' && (
          <>
            <label className="authModal__label mb-3">
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
            <label className="authModal__label mb-3">
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
              {errors.passwordRepeat &&
                errors.passwordRepeat.type === 'match' && (
                  <span className="authModal__formErrorMessage">
                    {translate('passwordConfirmationError')}
                  </span>
                )}
            </label>
          </>
        )}
        <button
          type="submit"
          className="authModal__submitBtn mb-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="spinner-border text-color" />
          ) : (
            (modalMode === 'confirmPasswordRestore' &&
              translate('restorePassword')) ||
            (modalMode === 'confirmPasswordSignUp' &&
              translate('confirmSignUp'))
          )}
        </button>
        <button
          type="button"
          className="authModal__textBtn authModal__textBtn-colorBlue d-block mx-auto"
          onClick={handleResend}
        >
          {translate('resend')}
        </button>
      </form>
    </>
  );
};

export default withRouter(withTranslate(ConfirmPasswordForm));
