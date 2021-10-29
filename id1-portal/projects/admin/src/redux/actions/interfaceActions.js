import * as types from '../actionTypes.js';

const toggleIsEditorInFullScreen = (payload) => {
  return {
    type: types.TOGGLE_IS_EDITOR_FULLSCREEN,
    payload,
  };
};

const updateMainSettingsModal = (payload) => {
  return {
    type: types.UPDATE_MAIN_SETTINGS_MODAL,
    payload,
  };
};

export default {
  toggleIsEditorInFullScreen,
  updateMainSettingsModal,
};
