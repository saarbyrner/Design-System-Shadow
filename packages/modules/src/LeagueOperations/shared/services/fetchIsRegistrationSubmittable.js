// @flow
import { axios } from '@kitman/common/src/utils/services';

type RequestParams = {
  requirementId: number,
  userId: number,
};

type Response = {
  active: boolean,
  id: number,
  registration_completable: boolean,
  registration_complete: boolean,
  additional_info: string | null,
};

const fetchIsRegistrationSubmittable = async ({
  requirementId,
  userId,
}: RequestParams): Promise<Response> => {
  const { data } = await axios.get(
    `/registration/requirements/${requirementId}?user_id=${userId}`
  );
  return data;
};

export default fetchIsRegistrationSubmittable;
