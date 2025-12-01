// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AssessmentGroup } from '../../types/index';

export type AssessmentGroupFilters = {
  assessment_template_ids?: Array<number>,
  athlete_ids?: ?Array<number>,
  athlete_id?: number,
  list_view?: ?boolean,
  next_id?: ?number,
  position_group_ids?: ?Array<number>,
};

type AssessmentGroups = {
  assessment_groups: Array<AssessmentGroup>,
  next_id: ?number,
};

export const GENERIC_GET_ASSESSMENT_GROUPS_ENDPOINT =
  '/assessment_groups/search';

const getAssessmentGroups = async (
  filters: AssessmentGroupFilters
): Promise<AssessmentGroups> => {
  const { data } = await axios.post(
    GENERIC_GET_ASSESSMENT_GROUPS_ENDPOINT,
    filters
  );
  return data;
};

export default getAssessmentGroups;
