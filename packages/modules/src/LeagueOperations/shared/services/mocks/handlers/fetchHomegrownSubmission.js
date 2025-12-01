// @flow
import { rest } from 'msw';

import { meta, data } from '../data/mock_homegrown_list';

const response = {
  data: data[0],
  meta,
};

const handler = rest.get(
  '/registration/homegrown/:submission_id',
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };
