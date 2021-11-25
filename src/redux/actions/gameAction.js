import fetchQuestionAPI from '../../services/questionAPI';

export const RECEIVED_API_QUEST = 'RECEIVED_API_QUEST';

export const getApi = (payload) => ({ type: RECEIVED_API_QUEST, payload });

export const getQuestions = () => async (dispatch) => {
  const results = await fetchQuestionAPI();
  dispatch(getApi(results));
};
