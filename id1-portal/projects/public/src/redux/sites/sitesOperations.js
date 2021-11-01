import { getGovSites } from '../../services/index.js';
import actions from './sitesActions.js';

export const getSites = (language = 'ua') => async (dispatch) => {
  try {
    dispatch(actions.setIsLoadingTrue());
    const response = await getGovSites(language);
    if (response.status !== 'ok') {
      dispatch(actions.getSitesError(response.error_message));
      console.log('Error :>> ', response.error_message);
      return;
    }
    dispatch(actions.getSitesSuccess(response));
  } catch (error) {
    dispatch(actions.getSitesError(error.message));
    console.log('Error :>> ', error);
  } finally {
    dispatch(actions.setIsLoadingFalse());
  }
};
