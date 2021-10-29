import * as types from '../actionTypes.js';

const initialState = [];

const navMenuReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case types.GET_NAVMENU_SETTINGS_success:
      return payload.data.settings_object;

    case types.GET_NAVMENU_SETTINGS_error:
      return state;

    default:
      return state;
  }
};

export default navMenuReducer;
