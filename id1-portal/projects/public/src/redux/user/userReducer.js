import * as types from '../actionTypes.js';

const initialState = {
  error: null,
  isLoading: false,
  birthday: null,
  email: '',
  first_name: '',
  last_name: '',
  patronymic: '',
  phone: '',
  userId: null,
  isAuth: false,
};

const userReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case types.USER_SET_IS_LOADING_TRUE:
      return {
        ...state,
        isLoading: true,
      };

    case types.USER_SET_IS_LOADING_FALSE:
      return {
        ...state,
        isLoading: false,
      };

    case types.GET_CURRENT_USER_success:
      return {
        ...payload,
        error: null,
        isLoading: false,
      };

    case types.GET_CURRENT_USER_error:
      return { ...state, error: payload, isLoading: false };

    case types.UPDATE_CURRENT_USER_success:
      return {
        ...state,
        ...payload,
        error: null,
        isLoading: false,
      };

    case types.UPDATE_CURRENT_USER_error:
      return { ...state, error: payload, isLoading: false };

    default:
      return state;
  }
};

export default userReducer;
