// @flow
import { rest } from 'msw';

import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registrations_sections';

const handler = rest.post(
  '/registration/registrations/:id/sections/search',
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };
