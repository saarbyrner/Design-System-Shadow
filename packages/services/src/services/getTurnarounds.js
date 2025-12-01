// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';

const getTurnarounds = async (): Promise<Turnaround[]> => {
  const { data } = await axios.get('/ui/turnarounds', {
    headers: {
      Accept: 'application/json',
    },
  });

  return data;
};

export default getTurnarounds;
