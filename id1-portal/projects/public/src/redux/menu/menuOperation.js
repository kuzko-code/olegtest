import { getMenuSettings } from '../../services';
import actions from './menuActions.js';

export const getMenuSettingsData = (language) => async (dispatch) => {
  try {
    const response = await getMenuSettings(language);
    if (response.status !== 'ok') {
      dispatch(actions.getMenuSettingsError(response.error_message));
      console.error('Error: ', response.error_message);
      return;
    }
    dispatch(actions.getMenuSettingsSuccess(response));
  } catch (error) {
    dispatch(actions.getMenuSettingsError(error.message));
    console.error('Error: ', error.message);
  }
};
