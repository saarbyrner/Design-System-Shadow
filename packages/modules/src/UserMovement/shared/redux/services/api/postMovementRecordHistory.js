// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Meta, MovementType } from '../../../types';

export type HistoricalMovementRecord = {
  athlete: {
    firstname: string,
    id: number,
    lastname: string,
    user_id: number,
    username: string,
  },
  data_sharing_consent: boolean,
  registration_data_sharing: boolean,
  id: number,
  joined_at: string,
  left_at: ?string,
  organisation: {
    id: number,
    name: string,
    logo_full_path?: string,
  },
  transfer_type: MovementType,
};

type RequestResponse = {
  data: Array<HistoricalMovementRecord>,
  meta: Meta,
};

// These will be expanded in the future. Use case for now is by userId only
export type Params = {
  userId: number,
  transfer_type: ?MovementType,
};

const fetchMovementRecordHistory = async (
  params: Params
): Promise<RequestResponse> => {
  const { userId, ...rest } = params;
  let response: RequestResponse;

  try {
    response = await axios.post(`/user_movements/${userId}/records`, null, {
      params: rest,
    });
  } catch (err) {
    throw new Error(err);
  }
  return response.data;
};

export default fetchMovementRecordHistory;
