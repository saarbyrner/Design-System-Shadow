// @flow
import { rest } from 'msw';
import { BULK_UPDATE_PRIMARY_SQUAD_ENDPOINT } from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkUpdatePrimarySquad';

const data = {};

const handler = rest.put(BULK_UPDATE_PRIMARY_SQUAD_ENDPOINT, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
