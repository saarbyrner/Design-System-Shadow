// @flow
import { rest } from 'msw';

import { data } from '../data/mock_additional_users_list';

const handler = rest.post('/settings/additional_users', (req, res, ctx) =>
  res(ctx.json(data[0]))
);

export { handler, data };
