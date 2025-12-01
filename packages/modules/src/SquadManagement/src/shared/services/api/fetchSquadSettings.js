// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { SquadSetting } from '../../types';

export type RequestResponse = Array<SquadSetting>;

const fetchSquadSettings = async (): Promise<RequestResponse> => {
  const { data } = await axios.get('/settings/squads', {
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
  });
  return data;
};

export default fetchSquadSettings;
