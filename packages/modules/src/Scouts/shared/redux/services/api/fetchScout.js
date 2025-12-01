// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Scout } from '@kitman/modules/src/Scouts/shared/types';

const fetchScout = async (id: number): Promise<Scout> => {
  const { data } = await axios.get(`/settings/scouts/${id}`);

  return data;
};

export default fetchScout;
