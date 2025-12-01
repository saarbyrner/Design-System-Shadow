// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { ShortRulesets } from '../../types';

const fetchShortRulesets = async (): Promise<ShortRulesets> => {
  const { data } = await axios.get(
    `/conditional_fields/rulesets/injury_surveillance`,
    {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
  return data;
};

export default fetchShortRulesets;
