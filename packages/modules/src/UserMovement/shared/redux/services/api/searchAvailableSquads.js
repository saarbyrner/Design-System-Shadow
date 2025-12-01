// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Meta, MovementOrganisation } from '../../../types';

export type RequestResponse = {
  data: Array<MovementOrganisation>,
  meta: Meta,
};

type Params = {
  id: number,
};

const searchAvailableSquads = async (
  params: Params
): Promise<RequestResponse> => {
  try {
    const { data } = await axios.get(`/ui/organisation/organisations/squads`, {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
      params,
    });
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default searchAvailableSquads;
