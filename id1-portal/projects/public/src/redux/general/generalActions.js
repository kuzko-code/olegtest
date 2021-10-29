import * as types from '../actionTypes.js';

const setAuthModalShownTrue = () => {
  return {
    type: types.SET_AUTH_MODAL_SHOWN_true,
  };
};

const setAuthModalShownFalse = () => {
  return {
    type: types.SET_AUTH_MODAL_SHOWN_false,
  };
};

export default {
  setAuthModalShownTrue,
  setAuthModalShownFalse,
};
