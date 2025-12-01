// @flow
import { rest } from 'msw';
import { GENERIC_CREATE_ASSESSMENT_GROUP_ENDPOINT } from '@kitman/services/src/services/assessmentGroup/createAssessmentGroup';
import { mockAssessmentGroupData } from './mockData';

const data = {
  assessment_group: mockAssessmentGroupData,
};

const handler = rest.post(
  GENERIC_CREATE_ASSESSMENT_GROUP_ENDPOINT,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
