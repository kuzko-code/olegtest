import * as types from '../actionTypes.js';

const initialState = {
  isEditorInFullscreen: false,
  mainSettingsModal: { type: null, id: null, coordX: null, coordY: null },
};

const interfaceReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case types.TOGGLE_IS_EDITOR_FULLSCREEN:
      return { ...state, isEditorInFullscreen: payload };

    case types.UPDATE_MAIN_SETTINGS_MODAL:
      return { ...state, mainSettingsModal: payload };

    default:
      return state;
  }
};

export default interfaceReducer;
