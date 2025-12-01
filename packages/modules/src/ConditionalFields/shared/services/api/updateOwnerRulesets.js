// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Ruleset } from '../../types';

export type RequestResponse = {
  data: Ruleset,
};

const updateOwnerRulesets = async (): Promise<RequestResponse> => {
  const { data } = await axios.post(`/conditional_fields/rulesets`);

  return data;
};

export default updateOwnerRulesets;
