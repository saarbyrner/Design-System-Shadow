// @flow
import { axios } from '@kitman/common/src/utils/services';

export type OfficialForm = {
  firstname: string,
  lastname: string,
  email: string,
  date_of_birth: '',
  is_active: boolean,
};
export type RequestResponse = {
  message: string,
  status: number,
};

const editOfficial = async (
  officialId: number,
  official: OfficialForm
): Promise<RequestResponse> => {
  const { data } = await axios.put(`/settings/officials/${officialId}`, {
    official,
  });

  return data;
};

export default editOfficial;
