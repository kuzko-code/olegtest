import { getCurrentUser, updateUser } from '../../services/auth-api-service.js';
import actions from './userActions';

const initialState = {
  error: null,
  isLoading: false,
  isAuth: false,
  userId: null,
  first_name: '',
  last_name: '',
  patronymic: '',
  birthday: null,
  email: '',
  phone: '',
};

export const checkUser = () => async (dispatch) => {
  try {
    dispatch(actions.setIsLoadingTrue());
    const data = await getCurrentUser();
    data && data.userId
      ? dispatch(actions.getCurrentUserSuccess({ ...data, isAuth: true }))
      : dispatch(actions.getCurrentUserSuccess(initialState));
  } catch (error) {
    console.log('Error while checking current user :>> ', error);
    dispatch(actions.getCurrentUserError(error));
  }
};

export const updateCurrentUser = (body, setIsEdited) => async (dispatch) => {
  try {
    dispatch(actions.setIsLoadingTrue());
    await updateUser(body);
    dispatch(actions.updateCurrentUserSuccess(body));
    setIsEdited(false);
  } catch (error) {
    console.log('Error while updating the user :>> ', error);
    dispatch(actions.updateCurrentUserError(error));
  }
};
