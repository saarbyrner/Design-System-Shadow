// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ScoutForm, Scout } from '@kitman/modules/src/Scouts/shared/types';

const createScout = async (user: ScoutForm): Promise<Scout> => {
  const { data } = await axios.post('/settings/scouts', { user });
  return data;
};

export default createScout;
