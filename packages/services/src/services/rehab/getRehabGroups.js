// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { RehabGroup } from '@kitman/modules/src/Medical/shared/components/RehabTab/types';

const getRehabGroups = async (): Promise<Array<RehabGroup>> => {
  const { data } = await axios.get('/tags', {
    params: {
      scopes: ['Default'],
    },
  });

  return data;
};

export default getRehabGroups;
