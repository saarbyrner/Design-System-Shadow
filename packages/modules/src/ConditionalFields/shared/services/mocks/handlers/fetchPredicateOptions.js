// @flow
import { rest } from 'msw';

import { data } from '../data/mock_predicate_options_list';

const handler = rest.get(
  '/conditional_fields/predicate_options',
  ({ url }, res, ctx) => {
    let response = data;
    const params = url.searchParams;
    if (params.owner_type === 'Organisation' && params.owner_id === 2) {
      response = data;
    }
    return res(ctx.json(response));
  }
);

export { handler, data };
