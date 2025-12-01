// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  RequestResponse,
  Filters,
} from '@kitman/modules/src/Medical/shared/components/AthleteRosterTab/types';

export const GET_ATHLETE_ROSTER_URL = '/medical/rosters/fetch';

const getAthleteRoster = async (
  nextId: ?number,
  filters: Filters
): Promise<RequestResponse> => {
  const { data } = await axios.post(GET_ATHLETE_ROSTER_URL, {
    filters: {
      ...filters,
    },
    next_id: nextId || null,
  });

  return data;
};

export default getAthleteRoster;
