// @flow

import { axios } from '@kitman/common/src/utils/services';
import type {
  SearchByAthleteParams,
  FetchFormAnswerSetsByAthleteResponse,
} from './types';

export const SEARCH_BY_ATHLETE_URL =
  '/forms/form_answers_sets/search_by_athlete';

const searchFormAnswerSetsByAthlete = async (
  params?: SearchByAthleteParams
): Promise<FetchFormAnswerSetsByAthleteResponse> => {
  const { data } = await axios.post(SEARCH_BY_ATHLETE_URL, {
    statuses: params?.statuses,
    athlete_ids: params?.athleteIds,
    form_ids: params?.formIds,
    date_range:
      params?.startDate || params?.endDate
        ? {
            start_date: params?.startDate,
            end_date: params?.endDate,
          }
        : undefined,
    pagination: {
      page: params?.page ?? 1,
      per_page: params?.per_page ?? 25,
    },
    isInCamelCase: true,
  });
  return data;
};

export default searchFormAnswerSetsByAthlete;
