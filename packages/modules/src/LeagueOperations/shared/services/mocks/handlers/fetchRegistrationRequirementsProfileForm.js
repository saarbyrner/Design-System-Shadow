// @flow
import { rest } from 'msw';
import data from '../data/mock_registration_profile_form';

const handler = rest.post(
  '/registration/users/:user_id/profile',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
