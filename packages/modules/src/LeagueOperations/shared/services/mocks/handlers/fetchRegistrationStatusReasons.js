// @flow
import { rest } from 'msw';
import response from '../data/mock_registration_status_reasons';

const handler = rest.get('/ui/registration_status_reasons', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler };
