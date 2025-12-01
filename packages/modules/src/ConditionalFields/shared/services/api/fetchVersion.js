// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Version } from '../../types';

const fetchVersion = async ({
  rulesetId,
  versionId,
}: {
  rulesetId: string,
  versionId: string,
}): Promise<Version> => {
  const { data } = await axios.get(
    `/conditional_fields/rulesets/${rulesetId}/versions/${versionId}`,
    {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
  return data;
};

export default fetchVersion;
