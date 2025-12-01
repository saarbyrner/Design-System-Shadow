// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Ruleset } from '../../types';

const updateOwnerRuleset = async ({
  rulesetId,
  name,
}: {
  rulesetId: string,
  name: string,
}): Promise<Ruleset> => {
  const { data } = await axios.patch(
    `/conditional_fields/rulesets/${rulesetId}`,
    {
      name,
    }
  );
  return data;
};

export default updateOwnerRuleset;
