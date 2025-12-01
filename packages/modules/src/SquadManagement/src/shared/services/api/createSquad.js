// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Squad } from '../../types';
import type { FormState as SquadForm } from '../../hooks/useCreateSquad';

export type RequestResponse = Squad;

const createSquad = async (squad: SquadForm): Promise<RequestResponse> => {
  const { data } = await axios.post('/settings/squads', { squad });

  return data;
};

export default createSquad;
