import { rest } from 'msw';
import { GENERIC_GET_ASSESSMENT_GROUPS_ENDPOINT } from '@kitman/services/src/services/assessmentGroup/getAssessmentGroups';
import { mockAssessmentGroupData } from './mockData';

const data = {
  assessment_groups: [mockAssessmentGroupData],
  next_id: null,
};

const handler = rest.post(
  GENERIC_GET_ASSESSMENT_GROUPS_ENDPOINT,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
