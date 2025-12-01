// @flow
import { rest } from 'msw';

import { data } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_requirement';

const handler = rest.post(
  '/registration/requirements/:id/form',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
