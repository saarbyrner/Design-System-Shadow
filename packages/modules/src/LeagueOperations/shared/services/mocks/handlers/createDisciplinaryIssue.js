// @flow
import { rest } from 'msw';
import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_discipline_reasons';

const handler = rest.post('/discipine/discipline_reasons', (req, res, ctx) =>
  res(ctx.status(response))
);

export { handler, response };
