/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { RegistrationHistory } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type RequestResponse = {
  data: RegistrationHistory,
};

const fetchRegistrationHistory = async ({
  user_id,
  id,
}: {
  user_id: number | string,
  id: number | string,
}): Promise<RequestResponse> => {
  try {
    const { data } = await axios.get(
      `/registration/users/${user_id}/registrations/${id}/history`
    );
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchRegistrationHistory;
