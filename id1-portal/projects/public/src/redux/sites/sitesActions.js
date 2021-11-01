import * as types from '../actionTypes.js';

const clearError = () => {
  return {
    type: types.CLEAR_ERROR,
  };
};

const setIsLoadingTrue = () => {
  return {
    type: types.SET_IS_SITES_LOADING_TRUE,
  };
};

const setIsLoadingFalse = () => {
  return {
    type: types.SET_IS_SITES_LOADING_FALSE,
  };
};

const getSitesSuccess = (payload) => {
  return {
    type: types.GET_SITES_success,
    payload,
  };
};

const getSitesError = (payload) => {
  return {
    type: types.GET_SITES_error,
    payload,
  };
};

export default {
  setIsLoadingTrue,
  setIsLoadingFalse,
  clearError,
  getSitesSuccess,
  getSitesError,
};
