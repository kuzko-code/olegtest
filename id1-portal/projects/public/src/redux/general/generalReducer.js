import * as types from '../actionTypes.js';

const initialState = { isAuthModalShown: false };

const generalReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case types.SET_AUTH_MODAL_SHOWN_true:
      return { ...state, isAuthModalShown: true };

    case types.SET_AUTH_MODAL_SHOWN_false:
      return { ...state, isAuthModalShown: false };

    default:
      return state;
  }
};

export default generalReducer;
