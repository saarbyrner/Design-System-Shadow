// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Ruleset } from '../../types';

const fetchVersions = async (id: string): Promise<Ruleset> => {
  const { data } = await axios.get(`/conditional_fields/rulesets/${id}`, {
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
  });
  return data;
};

export default fetchVersions;
