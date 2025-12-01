/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';
import {
  type RegistrationStatus,
  type RequirementUpdateAnnotation,
} from '../types/common';

export type Args = {
  user_id: number,
  status: RegistrationStatus,
  annotation: ?string,
  registration_id: number,
  registration_system_status_id?: number,
};

type Response = {
  id: number,
  status: RegistrationStatus,
  created_at: string,
  annotations: Array<RequirementUpdateAnnotation>,
};

const updateRegistrationStatus = async ({
  user_id,
  registration_id,
  annotation,
  status,
  registration_system_status_id,
}: Args): Promise<Response> => {
  try {
    const { data } = await axios.post(
      `/registration/users/${user_id}/registrations/${registration_id}/status`,
      {
        annotation,
        status,
        registration_system_status_id,
      }
    );
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default updateRegistrationStatus;
