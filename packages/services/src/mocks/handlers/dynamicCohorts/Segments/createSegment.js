// @flow
import { rest } from 'msw';
import baseSegmentsURL from '@kitman/services/src/services/dynamicCohorts/Segments/consts';
import { data as staffData } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { createLabelExpression } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/src/utils';
import { labels as mockLabels } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';

export const segmentRequest = {
  name: 'My Segment',
  expression: createLabelExpression(mockLabels.map((label) => label.name)),
};

export const segmentResponse = {
  ...segmentRequest,
  // the BE returns a string version of the expression
  expression: JSON.stringify(segmentRequest.expression),
  id: 10,
  created_by: { id: staffData[0].id, fullname: staffData[0].fullname },
  created_on: '2024-01-29T20:07:41Z',
};

const handler = rest.post(baseSegmentsURL, (req, res, ctx) =>
  res(ctx.json(segmentResponse))
);

export default handler;
