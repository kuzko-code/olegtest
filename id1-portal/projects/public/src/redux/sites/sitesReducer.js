import * as types from '../actionTypes.js';

const initialState = {
  error: null,
  isLoading: false,
  data: null,
};

const sitesReducer = (state = initialState, { payload, type }) => {
  switch (type) {
     case types.SET_IS_SITES_LOADING_TRUE:
      return { ...state, isLoading: true };

    case types.SET_IS_SITES_LOADING_FALSE:
      return { ...state, isLoading: false };

    case types.GET_SITES_success:
      return {
        ...state,
        data: payload.data,
      };

    case types.GET_SITES_error:
      return { ...state, error: payload };

    default:
      return state;
  }
};

export default sitesReducer;
