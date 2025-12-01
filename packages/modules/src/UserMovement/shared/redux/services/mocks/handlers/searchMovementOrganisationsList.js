// @flow
import { rest } from 'msw';

import { response } from '../data/mock_search_movement_organisation_list';

const handler = rest.post('/ui/associations/organisations', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };
