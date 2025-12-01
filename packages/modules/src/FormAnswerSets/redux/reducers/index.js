// @flow

import {
  REDUCER_KEY as FORM_ANSWER_SET_REDUCER_KEY,
  formAnswerSetsSlice,
} from '../slices/formAnswerSetsSlice';

export default {
  [FORM_ANSWER_SET_REDUCER_KEY]: formAnswerSetsSlice.reducer,
};
