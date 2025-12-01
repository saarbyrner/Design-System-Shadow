// @flow
import { rest } from 'msw';

import { data } from '../data/mock_repay_form';

const handler = rest.get('/registration/payments/repay_form', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
