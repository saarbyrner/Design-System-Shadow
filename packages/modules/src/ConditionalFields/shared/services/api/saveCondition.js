// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { ActiveCondition, ConditionWithQuestions } from '../../types';

const saveCondition = async ({
  rulesetId,
  versionId,
  condition,
}: {
  rulesetId: string,
  versionId: string,
  condition: ActiveCondition,
}): Promise<ConditionWithQuestions> => {
  const { data } = await axios.post(
    `/conditional_fields/rulesets/${rulesetId}/versions/${versionId}/conditions`,
    condition
  );
  return data;
};

export default saveCondition;
