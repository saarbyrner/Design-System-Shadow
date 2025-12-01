// @flow
import { rest } from 'msw';
import data from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_create_registration';

const handler = rest.post(
  '/registration/users/:id/registrations/submit',
  (req, res, ctx) => res(ctx.status(200))
);

export { handler, data };
