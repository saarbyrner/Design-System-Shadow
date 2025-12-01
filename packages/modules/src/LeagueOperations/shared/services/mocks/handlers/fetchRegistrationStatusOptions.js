// @flow
import { rest } from 'msw';
import response from '../data/mock_registration_statuses';

const handler = rest.get('/ui/registration/statuses', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler };
