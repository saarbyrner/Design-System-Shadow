// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Athlete } from '@kitman/modules/src/Medical/shared/types';
import type { PastAthletesGridPayload } from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/types';

export type RequestResponse = {
  athletes: Array<Athlete>,
  meta: {
    next_page: number,
    current_page: number,
    prev_page: number,
    total_count: number,
    total_pages: number,
  },
};

const getPastAthletes = async ({
  filters,
  page,
}: PastAthletesGridPayload): Promise<RequestResponse> => {
  const { data } = await axios.post(
    '/medical/rosters/past_athletes',
    {
      filters,
      page,
    },
    {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  return data;
};

export default getPastAthletes;
