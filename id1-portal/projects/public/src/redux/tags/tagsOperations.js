import { getPopularTags } from '../../services/index.js';
import actions from '../tags/tagsActions.js';

export const getTags = (language = 'ua') => async (dispatch) => {
  try {
    dispatch(actions.setIsLoadingTrue());
    const response = await getPopularTags(language);
    if (response.status !== 'ok') {
      dispatch(actions.getTagsError(response.error_message));
      console.log('Error :>> ', response.error_message);
      return;
    }
    dispatch(actions.getTagsSuccess(response));
  } catch (error) {
    dispatch(actions.getTagsError(error.message));
    console.log('Error :>> ', error);
  } finally {
    dispatch(actions.setIsLoadingFalse());
  }
};
