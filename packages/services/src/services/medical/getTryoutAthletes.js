// @flow
import getCookie from '@kitman/common/src/utils/getCookie';

import type {
  RequestResponse,
  Filters,
} from '@kitman/modules/src/Medical/shared/components/AthleteTryoutsTab/types';

const getTryoutAthletes = async (
  filters: Filters
): Promise<RequestResponse> => {
  const response = await fetch('/medical/rosters/tryout_athletes', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-KITMAN-CSRF-TOKEN': getCookie('KITMAN-CSRF-TOKEN'),
    },
    method: 'POST',
    body: JSON.stringify({
      filters: {
        ...filters,
      },
    }),
  });

  return response.json();
};

export default getTryoutAthletes;
