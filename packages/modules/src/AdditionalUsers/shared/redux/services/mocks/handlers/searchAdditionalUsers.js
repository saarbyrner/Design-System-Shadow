// @flow
import { rest } from 'msw';

import { response } from '../data/mock_additional_users_list';

const handler = rest.post(
  '/settings/additional_users/search',
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };
