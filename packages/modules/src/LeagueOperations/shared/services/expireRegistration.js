// @flow
import { axios } from '@kitman/common/src/utils/services';

type RequestParams = {
  userId: number,
  registrationId: number,
};

type RequestResponse = {
  id: number,
  user_id: number,
  status: string,
};

export type ExpiredRegistrationType = Array<{
  id: number,
  name: string,
  type: string,
}>;

const expireRegistration = async ({
  userId,
  registrationId,
}: RequestParams): Promise<RequestResponse> => {
  const { data } = await axios.post(
    `/registration/users/${userId}/registrations/${registrationId}/expire`
  );

  return data;
};

export default expireRegistration;
