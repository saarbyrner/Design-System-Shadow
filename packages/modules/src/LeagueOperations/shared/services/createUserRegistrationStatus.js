// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { RegistrationStatusTypes } from '../types/common';

export type CreateUserRegistrationStatusPayload = {
  annotation?: string,
  status: RegistrationStatusTypes,
  registration_system_status_id?: number,
  reason_id?: number,
};

const createUserRegistrationStatus = async ({
  userId,
  userRegistrationId,
  payload,
}: {
  userId: number,
  userRegistrationId: number,
  payload: CreateUserRegistrationStatusPayload,
}): Promise<Response> => {
  const url = `/registration/users/${userId}/registrations/${userRegistrationId}/status`;

  const { data } = await axios.post(url, payload);

  return data;
};

export default createUserRegistrationStatus;
