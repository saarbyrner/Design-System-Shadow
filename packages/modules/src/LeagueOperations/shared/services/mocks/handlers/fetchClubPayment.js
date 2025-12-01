// @flow
import { rest } from 'msw';

import { data } from '../data/mock_club_payment';

const handler = rest.get(
  '/registration/payments/club_payment',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
