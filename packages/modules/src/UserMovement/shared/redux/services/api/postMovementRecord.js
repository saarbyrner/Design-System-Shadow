// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import type { MovementFormState } from '../../slices/userMovementDrawerSlice';
import type { MovementType } from '../../../types';

type AthleteAccessGrant = {
  id: number,
  athlete: {
    id: number,
    firstname: string,
    lastname: string,
  },
  grant_from_organisation: {
    id: number,
    name: string,
  },
  grant_to_organisation: {
    id: number,
    name: string,
  },
  start_date: string,
  end_date: string,
  player_movement_id: number,
  granting_user: {
    id: number,
    fullname: string,
  },
  attachments: Array<Attachment>,
};

type MovementRecord = {
  id: number,
  organisation: {
    id: number,
    name: string,
  },
  transfer_type: MovementType,
  joined_at: string,
  left_at?: string,
  data_sharing_consent: boolean,
  registration_data_sharing: boolean,
  athlete_access_grant?: AthleteAccessGrant,
};

export type RequestResponse = {
  message: string | MovementRecord,
};

const postMovementRecord = async (
  params: MovementFormState
): Promise<RequestResponse> => {
  const { data } = await axios.post('/user_movements', params);

  return data;
};

export default postMovementRecord;
