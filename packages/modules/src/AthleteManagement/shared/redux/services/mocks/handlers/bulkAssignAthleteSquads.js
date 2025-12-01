// @flow
import { rest } from 'msw';
import { BULK_ASSIGN_ATHLETE_SQUADS_ENDPOINT } from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkAssignAthleteSquads';

const data = {};

const handler = rest.put(BULK_ASSIGN_ATHLETE_SQUADS_ENDPOINT, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
