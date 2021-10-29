import actions from '../newsByRubric/newsByRubricActions.js';

export const getNewsByRubrics = (
  rubrics,
  rubricTitle,
  language = 'ua',
  isPublished = true
) => async (dispatch) => {
  try {
    const responseJson = await fetch(
      `${process.env.API_HOST}/getNewsByRubrics?fields=id,title,published_date,main_picture&rubrics=${rubrics}&isPublished=${isPublished}&sortField=published_date&sortDirection=desc&count=10&language=${language}`
    );
    const response = await responseJson.json();

    if (response.status !== 'ok') {
      dispatch(actions.getNewsByRubricError(response.error_message));
      return;
    }
    dispatch(actions.getNewsByRubricSuccess({ data: response, rubricTitle }));
  } catch (error) {
    dispatch(actions.getNewsByRubricError(error.message));
  }
};
