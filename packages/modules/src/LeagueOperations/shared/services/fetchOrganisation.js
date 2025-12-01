// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Organisation } from '@kitman/modules/src/LeagueOperations/shared/types/common';

const fetchOrganisation = async (
  id: number | string
): Promise<Organisation> => {
  const { data } = await axios.get(`/registration/organisations/${id}`, {
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
  });

  return data;
};

export default fetchOrganisation;
