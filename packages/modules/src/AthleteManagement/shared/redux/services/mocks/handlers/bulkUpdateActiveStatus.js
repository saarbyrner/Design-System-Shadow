// @flow
import { rest } from 'msw';
import { BULK_UPDATE_ACTIVE_STATUS_ENDPOINT } from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkUpdateActiveStatus';

const data = {};

const handler = rest.patch(
  BULK_UPDATE_ACTIVE_STATUS_ENDPOINT,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
