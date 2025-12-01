// @flow
import { rest } from 'msw';

import { data } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_organisations_list';

const handler = rest.get('/registration/organisations/115', (req, res, ctx) =>
  res(ctx.json(data[0]))
);

export { handler, data };
