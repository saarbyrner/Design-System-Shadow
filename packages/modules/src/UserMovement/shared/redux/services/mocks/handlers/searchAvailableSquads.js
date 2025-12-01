// @flow
import { rest } from 'msw';

import { response } from '../data/mock_search_available_squads';

const handler = rest.get(
  '/ui/organisation/organisations/squads',
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };
