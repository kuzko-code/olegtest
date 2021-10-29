import * as types from '../actionTypes.js';

const clearError = () => {
  return {
    type: types.CLEAR_ERROR,
  };
};

const setIsLoadingTrue = () => {
  return {
    type: types.SET_IS_TAGS_LOADING_TRUE,
  };
};

const setIsLoadingFalse = () => {
  return {
    type: types.SET_IS_TAGS_LOADING_FALSE,
  };
};

const getTagsSuccess = (payload) => {
  return {
    type: types.GET_TAGS_success,
    payload,
  };
};

const getTagsError = (payload) => {
  return {
    type: types.GET_TAGS_error,
    payload,
  };
};

export default {
  setIsLoadingTrue,
  setIsLoadingFalse,
  clearError,
  getTagsSuccess,
  getTagsError,
};
