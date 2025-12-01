// @flow
import { rest } from 'msw';

import { data } from '../data/mock_payment_history';

const handler = rest.post('/registration/payments/export', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
