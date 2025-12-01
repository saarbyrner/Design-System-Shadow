// @flow
import { rest } from 'msw';

import data from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_completed_requirements';

const handler = rest.get(
  '/registration/users/:user_id/registrations/:registration_id',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
