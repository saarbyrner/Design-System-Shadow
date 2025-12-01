// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  AdditionalUser,
  AdditionalUserFormState,
} from '@kitman/modules/src/AdditionalUsers/shared/types';

const createAdditionalUser = async (
  user: AdditionalUserFormState
): Promise<AdditionalUser> => {
  const { data } = await axios.post('/settings/additional_users', { user });
  return data;
};

export default createAdditionalUser;
