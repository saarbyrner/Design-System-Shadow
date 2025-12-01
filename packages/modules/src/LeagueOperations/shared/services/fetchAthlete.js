// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Athlete } from '@kitman/modules/src/LeagueOperations/shared/types/common';

const fetchAthlete = async (id: string | number): Promise<Athlete> => {
  const { data } = await axios.get(`/registration/athletes/${id}`);
  return data;
};

export default fetchAthlete;
