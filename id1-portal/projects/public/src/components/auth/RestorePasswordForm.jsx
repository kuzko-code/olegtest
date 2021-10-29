import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import CloseIcon from '@material-ui/icons/Close';

import { updateCode } from '../../services/auth-api-service.js';
import { REGULAR_EXPRESSIONS } from '../../../config/index.jsx';
import actions from '../../redux/general/generalActions';

const defaultValues = {
  email: '',
};

const RestorePasswordForm = ({ setModalMode, translate, setEmail }) => {
  const dispatch = useDispatch();
  const language = useSelector(({ Intl }) => Intl.locale);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues, shouldFocusError: true });

  const [isLoading, setIsLoading] = useState(false);

  const handleCloseAuthModal = () => dispatch(actions.setAuthModalShownFalse());

  const onSubmit = async ({ email }) => {
    try {
      setIsLoading(true);
      await updateCode({ email, language });
      setEmail(email);
      setModalMode('confirmPasswordRestore');
    } catch (error) {
      setError('email', {
        type: 'emailNotFound',
      });
      console.log('Error while updating code:>> ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="border-bottom d-flex justify-content-between p-4">
        <h5 className="mb-0">{translate('passwordRecovery')}</h5>
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
          {translate('passwordRecoveryDescription')}
        </p>
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
        <button
          type="submit"
          className="authModal__submitBtn mb-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="spinner-border text-color" />
          ) : (
            translate('requestCode')
          )}
        </button>
      </form>
    </>
  );
};

export default withTranslate(RestorePasswordForm);
