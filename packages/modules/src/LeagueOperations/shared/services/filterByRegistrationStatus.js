// @flow
import { axios } from '@kitman/common/src/utils/services';

type RequestParams = {
  permissionGroup: string,
};

export type ApplicationStatusesType = Array<{
  id: number,
  name: string,
  type: string,
}>;

const filterByRegistrationStatus = async ({
  permissionGroup,
}: RequestParams): Promise<ApplicationStatusesType> => {
  const { data } = await axios.get(
    `/ui/registration_statuses?permission_group=${permissionGroup}`
  );
  
  return data;
};

export default filterByRegistrationStatus;
