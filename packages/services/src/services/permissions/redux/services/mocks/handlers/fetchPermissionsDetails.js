// @flow
import { rest } from 'msw';

import { data } from '../data/fetchPermissionsDetails';

const handler = rest.get(
  '/administration/staff/:staffId/permissions/edit',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
