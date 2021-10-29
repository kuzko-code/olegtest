import * as types from '../actionTypes.js';

const getMenuSettingsSuccess = (payload) => {
  return {
    type: types.GET_NAVMENU_SETTINGS_success,
    payload,
  };
};

const getMenuSettingsError = (payload) => {
  return {
    type: types.GET_NAVMENU_SETTINGS_error,
    payload,
  };
};

export default {
  getMenuSettingsSuccess,
  getMenuSettingsError,
};
