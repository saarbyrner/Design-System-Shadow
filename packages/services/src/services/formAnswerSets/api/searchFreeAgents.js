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

export const SEARCH_FREE_AGENTS_URL =
  '/forms/form_answers_sets/search_free_agents';

const searchFreeAgents = async (
  payload: SearchFormAnswersSetsBody
): Promise<FetchMultipleFormAnswersSetsResponse> => {
  const { data } = await axios.post(SEARCH_FREE_AGENTS_URL, {
    ...payload,
    isInCamelCase: true,
  });

  return data;
};

export default searchFreeAgents;
