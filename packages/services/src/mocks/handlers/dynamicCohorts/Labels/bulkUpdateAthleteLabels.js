// @flow
import { rest } from 'msw';
import { labelUpdateURL } from '@kitman/services/src/services/dynamicCohorts/Labels/bulkUpdateAthleteLabels';

const handler = rest.post(labelUpdateURL, (req, res, ctx) => res(ctx.json()));

export default handler;
