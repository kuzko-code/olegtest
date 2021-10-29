import * as types from '../actionTypes.js';

const clearError = () => {
  return {
    type: types.CLEAR_ERROR,
  };
};

const getNewsByRubricSuccess = (payload) => {
  return {
    type: types.GET_NEWS_BY_RUBRIC_success,
    payload,
  };
};

const getNewsByRubricError = (payload) => {
  return {
    type: types.GET_NEWS_BY_RUBRIC_error,
    payload,
  };
};

export default {
  clearError,
  getNewsByRubricSuccess,
  getNewsByRubricError,
};
