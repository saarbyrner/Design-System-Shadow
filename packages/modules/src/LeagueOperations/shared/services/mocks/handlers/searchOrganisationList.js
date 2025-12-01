// @flow
import { rest } from 'msw';

import { response } from '../data/mock_organisations_list';

const handler = rest.post(
  '/registration/organisations/search',
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };
