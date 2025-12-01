// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  AdditionalUser,
  AdditionalUserFormState,
} from '@kitman/modules/src/AdditionalUsers/shared/types';

type Props = {
  id: number,
  user: AdditionalUserFormState,
};

const updateAdditionalUser = async ({
  id,
  user,
}: Props): Promise<AdditionalUser> => {
  const { data } = await axios.put(`/settings/additional_users/${id}`, {
    user,
  });

  return data;
};

export default updateAdditionalUser;
