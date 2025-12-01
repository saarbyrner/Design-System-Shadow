// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Rulesets } from '../../types';

const fetchRulesets = async (): Promise<Rulesets> => {
  const { data } = await axios.get(`/conditional_fields/rulesets`, {
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
  });
  return data;
};

export default fetchRulesets;
