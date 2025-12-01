// @flow
import { rest } from 'msw';
import baseSegmentsURL from '@kitman/services/src/services/dynamicCohorts/Segments/consts';
import { segmentResponse } from './createSegment';

const handler = rest.get(
  `${baseSegmentsURL}/${segmentResponse.id}`,
  (req, res, ctx) => res(ctx.json(segmentResponse))
);

export default handler;
