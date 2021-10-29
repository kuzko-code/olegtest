import * as types from '../actionTypes.js';

const initialState = {
  error: null,
  isLoading: false,
  data: null,
};

const tagsReducer = (state = initialState, { payload, type }) => {
  switch (type) {
     case types.SET_IS_TAGS_LOADING_TRUE:
      return { ...state, isLoading: true };

    case types.SET_IS_TAGS_LOADING_FALSE:
      return { ...state, isLoading: false };

    case types.GET_TAGS_success:
      return {
        ...state,
        data: payload.data,
      };

    case types.GET_TAGS_error:
      return { ...state, error: payload };

    default:
      return state;
  }
};

export default tagsReducer;
