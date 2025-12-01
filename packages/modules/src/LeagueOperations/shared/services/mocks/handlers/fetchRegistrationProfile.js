// @flow
import { rest } from 'msw';
import { data } from '../data/mock_registration_profile';

const handler = rest.get('/registration/users/:id', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
