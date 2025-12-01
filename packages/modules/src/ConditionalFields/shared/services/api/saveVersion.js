// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { ActiveCondition, ConditionWithQuestions } from '../../types';

const saveVersion = async ({
  rulesetId,
  versionId,
  conditions,
  versionName,
}: {
  rulesetId: string,
  versionId: string,
  conditions: ?Array<ActiveCondition>,
  versionName: ?string,
}): Promise<ConditionWithQuestions> => {
  let payload;
  if (!conditions) {
    payload = {
      name: versionName,
    };
  } else if (!versionName) {
    payload = {
      conditions,
    };
  } else {
    payload = {
      conditions,
      name: versionName,
    };
  }
  const { data } = await axios.patch(
    `/conditional_fields/rulesets/${rulesetId}/versions/${versionId}`,
    payload
  );
  return data;
};

export default saveVersion;
