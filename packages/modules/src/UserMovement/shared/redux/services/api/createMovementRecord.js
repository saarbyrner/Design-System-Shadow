// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { MovementType, FormState } from '../../../types';

export type Response = {
  id: number,
  organisation: {
    id: number,
    name: string,
  },

  transfer_type: MovementType,
  joined_at: string,
  left_at: string,
  data_sharing_consent: boolean,
};

const createMovementRecord = async (params: FormState): Promise<Response> => {
  try {
    const { data } = await axios.post('/user_movements', params);

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default createMovementRecord;
