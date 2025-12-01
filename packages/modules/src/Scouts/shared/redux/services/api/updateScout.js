// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { ScoutForm, Scout } from '@kitman/modules/src/Scouts/shared/types';

type Props = {
  id: number,
  user: ScoutForm,
};

const updateScout = async ({ id, user }: Props): Promise<Scout> => {
  const { data } = await axios.put(`/settings/scouts/${id}`, {
    user,
  });

  return data;
};

export default updateScout;
