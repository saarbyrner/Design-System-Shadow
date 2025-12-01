// @flow
import { axios } from '@kitman/common/src/utils/services';

type RequestParams = {
  userId: number,
  registrationId: number,
};

export type ApplicationStatusesType = Array<{
  id: number,
  name: string,
  type: string,
}>;

const fetchApplicationStatuses = async ({
  userId,
  registrationId,
}: RequestParams): Promise<ApplicationStatusesType> => {
  const { data } = await axios.post(
    `/registration/users/${userId}/registrations/${registrationId}/available_statuses`
  );

  return data;
};

export default fetchApplicationStatuses;
