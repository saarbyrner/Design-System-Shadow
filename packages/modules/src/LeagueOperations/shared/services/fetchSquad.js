// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Squad } from '../types/common';

const fetchSquad = async (id: string | number): Promise<Squad> => {
  const { data } = await axios.get(`/registration/squads/${id}`, {
    headers: {
      Accept: 'application/json',
    },
  });
  return data;
};

export default fetchSquad;
