// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Ruleset } from '../../types';

export type RequestResponse = {
  data: Ruleset,
};

const updateOwnerVersions = async ({
  rulesetId,
}: {
  rulesetId: string,
}): Promise<RequestResponse> => {
  const { data } = await axios.post(
    `/conditional_fields/rulesets/${rulesetId}/versions/bump`
  );

  return data;
};

export default updateOwnerVersions;
