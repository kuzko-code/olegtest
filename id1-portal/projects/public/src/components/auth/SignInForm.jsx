import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { withTranslate } from 'react-redux-multilingual';
import CloseIcon from '@material-ui/icons/Close';

import { withRouter } from 'react-router-dom';
import { REGULAR_EXPRESSIONS } from '../../../config/index.jsx';
import actions from '../../redux/general/generalActions';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { setBearerToken } from '../../services/auth-service.js'
import { logIn } from '../../services/auth-api-service.js';

const defaultValues = {
  email: '',
  password: '',
  keepSignedIn: false,
};

const SignInForm = ({ setModalMode, translate }) => {
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

  const onSubmit = async ({ email, password, keepSignedIn }) => {
    const body = { email, password, keepSignedIn };
    try {
      setIsLoading(true);
      const { token } = await logIn(body);

      setBearerToken(token);

      handleCloseAuthModal();
    } catch (error) {
      console.log('Error while logging in:>> ', error);
      setError('password', {
        type: 'credentialError',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="border-bottom d-flex justify-content-between p-4">
        <h5 className="mb-0">{translate('signIn')}</h5>
        <button
          type="button"
          onClick={handleCloseAuthModal}
          className="authModal__textBtn authModal__textBtn-colorGrey"
        >
          <CloseIcon />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <label className="authModal__label mb-3">
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
          {errors.email && errors.email.type === 'emailNotFound' && (
            <span className="authModal__formErrorMessage">
              {translate('emailNotFound')}
            </span>
          )}
        </label>
        <label className="authModal__label mb-3">
          {translate('password')}

          <OutlinedInput
            id="outlined-adornment-password"
            fullWidth={true}
            inputProps={{ ...register('password', { required: true }) }}
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
          {errors.password && errors.password.type === 'credentialError' && (
            <p className="authModal__formErrorMessage">
              {translate('loginCredentialError')}
            </p>
          )}
        </label>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              id="AuthModal-checkbox"
              {...register('keepSignedIn')}
              className="authModal__inputCheckbox"
            />
            <label htmlFor="AuthModal-checkbox" className="mb-0">
              {translate('keepSigned')}
            </label>
          </div>
          <button
            type="button"
            className="authModal__textBtn authModal__textBtn-colorBlue"
            onClick={() => setModalMode('restore')}
          >
            {translate('forgotPassword')}
          </button>
        </div>
        <button
          type="submit"
          className="authModal__submitBtn mb-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="spinner-border text-color" />
          ) : (
            translate('logIn')
          )}
        </button>
        <button
          type="button"
          className="authModal__textBtn authModal__textBtn-colorBlue d-block mx-auto"
          onClick={() => setModalMode('signUp')}
        >
          {translate('signUp')}
        </button>
      </form>
    </>
  );
};

export default withRouter(withTranslate(SignInForm));
