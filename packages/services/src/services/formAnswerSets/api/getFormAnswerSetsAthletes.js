// @flow

import { axios } from '@kitman/common/src/utils/services';
import type { Athlete } from '@kitman/common/src/types/Athlete';

export type GetFormAnswerSetsAthletesResponse = {
  athletes: Array<Athlete>,
  meta: {
    current_page: number,
    next_page: ?number,
    prev_page: ?number,
    total_pages: number,
    total_count: number,
  },
};

export const GET_FORM_ANSWER_SETS_ATHLETES_URL =
  '/ui/forms/form_answers_sets/athletes';

const getFormAnswerSetsAthletes = async (params: {
  athlete_status_at_assignment: string,
}): Promise<GetFormAnswerSetsAthletesResponse> => {
  const { data } = await axios.get(GET_FORM_ANSWER_SETS_ATHLETES_URL, {
    params,
  });
  return data;
};

export default getFormAnswerSetsAthletes;
