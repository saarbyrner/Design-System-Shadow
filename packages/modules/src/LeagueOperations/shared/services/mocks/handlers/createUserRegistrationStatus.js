// @flow
import { rest } from 'msw';
import response from '../data/mock_create_user_registration_status';

const handler = rest.post(
  '/registration/users/:user_id/registrations/:user_registration_id/status',
  (req, res, ctx) => res(ctx.json(response))
);

export { handler };
