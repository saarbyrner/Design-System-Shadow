// @flow
import { axios } from '@kitman/common/src/utils/services';
import {
  type RegistrationStatus,
  type RequirementUpdateAnnotation,
} from '../types/common';

type Params = {
  userId: number,
  userRegistrationId: number,
};

export type Payload = {
  annotation: string,
  registration_status_id: number,
  registration_status_reason_id?: number,
};

type Response = {
  id: number,
  status: RegistrationStatus,
  created_at: string,
  annotations: Array<RequirementUpdateAnnotation>,
};

export const getUpdateUserRegistrationStatusUrl = ({
  userId,
  userRegistrationId,
}: Params) =>
  `/registration/users/${userId}/registrations/${userRegistrationId}/update_status`;

const updateUserRegistrationStatus = async ({
  userId,
  userRegistrationId,
  payload,
}: Params & { payload: Payload }): Promise<Response> => {
  const url = getUpdateUserRegistrationStatusUrl({
    userId,
    userRegistrationId,
  });
  const { data } = await axios.put(url, payload);

  return data;
};

export default updateUserRegistrationStatus;
