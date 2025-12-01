// @flow
import { axios } from '@kitman/common/src/utils/services';

export type searchExternalRequests = {
  association_id: string,
  scout_name: string,
  scout_surname: string,
  email: string,
  id: number,
};

export const searchSavedExternalAccessUsers = async (
  email?: string
): Promise<Array<searchExternalRequests>> => {
  const emailParam = email ? `?email=${email}` : '';
  const { data } = await axios.get(
    `/planning_hub/association_external_scouts${emailParam}`
  );
  return data;
};
