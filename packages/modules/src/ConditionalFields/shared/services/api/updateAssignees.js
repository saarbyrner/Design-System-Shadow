// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Assignees, Assignment } from '../../types';

const updateAssignees = async ({
  rulesetCurrentVersionId,
  assignments,
}: {
  rulesetCurrentVersionId: number,
  assignments: Array<Assignment>,
}): Promise<Assignees> => {
  const { data } = await axios.patch(
    `/conditional_fields/squad_assignments/${rulesetCurrentVersionId}`,
    {
      screening_ruleset_version_id: rulesetCurrentVersionId,
      assignments,
    }
  );
  return data;
};

export default updateAssignees;
