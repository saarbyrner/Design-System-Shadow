// @flow

import { axios } from '@kitman/common/src/utils/services';
import type {
  QuestionResponse,
  QuestionType,
} from '@kitman/services/src/services/formTemplates/api/types';

export const GET_QUESTION_BANKS_ROUTE = '/forms/question_banks';

const getQuestionBanks = async (
  questionType: QuestionType
): Promise<{ questions: Array<QuestionResponse> }> => {
  const params = {
    question_type: questionType,
  };

  const { data } = await axios.get(GET_QUESTION_BANKS_ROUTE, {
    params,
  });
  return data;
};

export default getQuestionBanks;
