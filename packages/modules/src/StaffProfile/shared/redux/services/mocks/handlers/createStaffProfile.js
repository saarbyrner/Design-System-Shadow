// @flow
import { rest } from 'msw';

import { data } from '../data/fetchStaffProfile';

const handler = rest.post('/administration/staff', (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
