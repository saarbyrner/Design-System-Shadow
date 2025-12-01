// @flow
import { rest } from 'msw';

import { data } from '../data/mock_additional_users_list';

const handler = rest.put('/settings/additional_users/1', (req, res, ctx) =>
  res(ctx.json(data[0]))
);

export { handler, data };
