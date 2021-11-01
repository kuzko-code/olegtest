import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Modal } from '@material-ui/core';

import SignInForm from '../SignInForm.jsx';
import SignUpForm from '../SignUpForm.jsx';
import ConfirmPasswordForm from '../ConfirmPasswordForm.jsx';
import RestorePasswordForm from '../RestorePasswordForm.jsx';
import actions from '../../../redux/general/generalActions';
import './AuthModal.css';


const AuthModal = (props) => {
  const { classes } = props;
  const dispatch = useDispatch();
  const isShown = useSelector(({ general }) => general.isAuthModalShown);

  const [modalMode, setModalMode] = useState('signIn');
  const [email, setEmail] = useState('');

  const onModalClose = () => dispatch(actions.setAuthModalShownFalse());

  return (
    <Modal open={isShown} onClose={onModalClose}>
      <div className="authModal__wrapper">
        {modalMode === 'signIn' && (
          <SignInForm modalMode={modalMode} setModalMode={setModalMode} />
        )}
        {modalMode === 'signUp' && (
          <SignUpForm
            modalMode={modalMode}
            setModalMode={setModalMode}
            setEmail={setEmail}
          />
        )}
        {modalMode === 'restore' && (
          <RestorePasswordForm
            setModalMode={setModalMode}
            setEmail={setEmail}
          />
        )}
        {(modalMode === 'confirmPasswordRestore' ||
          modalMode === 'confirmPasswordSignUp') && (
          <ConfirmPasswordForm modalMode={modalMode} email={email} />
        )}
      </div>
    </Modal>
  );
};

export default  withTranslate(AuthModal);
