// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AssessmentGroup } from '../../types/index';

export type AssessmentGroupCreate = {
  assessment_group_date: ?string,
  assessment_template_id: ?number,
  athlete_ids: Array<number>,
  event_id: ?number,
  event_type: ?string,
  name: string,
};

export const GENERIC_CREATE_ASSESSMENT_GROUP_ENDPOINT = '/assessment_groups';

const createAssessmentGroup = async (
  assessmentGroup: AssessmentGroupCreate
): Promise<{ assessment_group: AssessmentGroup }> => {
  const { data } = await axios.post(
    GENERIC_CREATE_ASSESSMENT_GROUP_ENDPOINT,
    assessmentGroup
  );
  return data;
};

export default createAssessmentGroup;
