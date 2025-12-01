// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Version } from '../../types';

const publishVersion = async ({
  rulesetId,
  versionId,
}: {
  rulesetId: string,
  versionId: string,
}): Promise<Version> => {
  const { data } = await axios.patch(
    `/conditional_fields/rulesets/${rulesetId}/versions/${versionId}/publish`
  );
  return data;
};

export default publishVersion;
