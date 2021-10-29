import * as types from '../actionTypes.js';

const setIsLoadingTrue = () => {
  return {
    type: types.USER_SET_IS_LOADING_TRUE,
  };
};

const setIsLoadingFalse = () => {
  return {
    type: types.USER_SET_IS_LOADING_FALSE,
  };
};

const getCurrentUserSuccess = (payload) => {
  return {
    type: types.GET_CURRENT_USER_success,
    payload,
  };
};

const getCurrentUserError = (payload) => {
  return {
    type: types.GET_CURRENT_USER_error,
    payload,
  };
};

const updateCurrentUserSuccess = (payload) => {
  return {
    type: types.UPDATE_CURRENT_USER_success,
    payload,
  };
};

const updateCurrentUserError = (payload) => {
  return {
    type: types.UPDATE_CURRENT_USER_error,
    payload,
  };
};

export default {
  setIsLoadingTrue,
  setIsLoadingFalse,
  getCurrentUserSuccess,
  getCurrentUserError,
  updateCurrentUserSuccess,
  updateCurrentUserError,
};
