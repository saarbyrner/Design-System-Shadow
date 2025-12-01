// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  PaginatedResponse,
  Registration,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

import wrapInPaginatedResponse from './utils';

const fetchRegistrationDetails = async ({
  id,
}: {
  id: number | string,
}): Promise<PaginatedResponse<Registration>> => {
  try {
    const { data } = await axios.post(
      `/registration/users/${id}/registrations/search`
    );
    return wrapInPaginatedResponse({ data });
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchRegistrationDetails;
