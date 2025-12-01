// @flow
import { rest } from 'msw';

import { data } from '../data/mock_post_movement_record_history';

const handler = rest.post('/user_movements/:userId/records', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
