// @flow

import { axios } from '@kitman/common/src/utils/services';
import type {
  SearchFormAnswersSetsBody,
  FetchMultipleFormAnswersSetsResponse,
} from '@kitman/services/src/services/formAnswerSets/api/types';

/**
 ** @param {
 **   category - string - optional
 **   athlete_id - number - optional
 **   group - string - optional
 **   form_type - string - optional
 **   key - string - optional
 **   statuses - Array<string> - optional
 **   date_range {  - optional
 **     start_date: string - required if date_range object passed
 **     end_date: string - required if date_range object passed
 **   }
 **   pagination { - required
 **     page - number - required
 **     per_page - number - required
 **   }
 **   form_id - number - optional
 **   only_assigned_forms -  boolean - optional
 **   user_id - number - optional
 ** }
 */

export const SEARCH_FORM_ANSWER_SETS_URL = '/forms/form_answers_sets/search';

const searchFormAnswerSets = async (
  requestBody: SearchFormAnswersSetsBody
): Promise<FetchMultipleFormAnswersSetsResponse> => {
  const body = { ...requestBody };

  const { data } = await axios.post(SEARCH_FORM_ANSWER_SETS_URL, {
    ...body,
    isInCamelCase: true,
  });

  return data;
};

export default searchFormAnswerSets;
