// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Squad, Meta } from '../../types';

export type RequestResponse = {
  data: Array<Squad>,
  meta: Meta,
};

const searchSquadList = async (): Promise<RequestResponse> => {
  const { data } = await axios.post('/registration/squads/search');

  return data;
};

export default searchSquadList;
