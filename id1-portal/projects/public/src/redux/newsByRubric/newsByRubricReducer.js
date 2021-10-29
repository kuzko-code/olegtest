import * as types from '../actionTypes.js';

const initialState = {
  error: null,
  data: {},
};

const newsByRubricReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case types.CLEAR_ERROR:
      return { ...state, error: null };

    case types.GET_NEWS_BY_RUBRIC_success:
      return {
        ...state,
        data: { ...state.data, [payload.rubricTitle]: payload.data.data },
      };

    case types.GET_NEWS_BY_RUBRIC_error:
      return { ...state, error: payload };

    default:
      return state;
  }
};

export default newsByRubricReducer;
