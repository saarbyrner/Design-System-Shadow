// @flow
import { rest } from 'msw';

import { data } from '../data/fetchStaffProfile';

const handler = rest.get(
  '/administration/staff/:staffId/edit',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
