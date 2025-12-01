// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AdditionalUser } from '@kitman/modules/src/AdditionalUsers/shared/types';

const fetchAdditionalUser = async (id: number): Promise<AdditionalUser> => {
  const { data } = await axios.get(`/settings/additional_users/${id}`);

  return data;
};

export default fetchAdditionalUser;
