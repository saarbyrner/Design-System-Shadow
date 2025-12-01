import { rest } from 'msw';
import { data } from '@kitman/services/src/services/humanInput/api/mocks/data/athleteProfile/fetchIntegrationSettings';

const handler = rest.get(
  '/athletes/:athleteId/integration_settings/edit',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
