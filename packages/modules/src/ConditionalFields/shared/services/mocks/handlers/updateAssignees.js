import { rest } from 'msw';

import { data } from '../data/assignees.mock';

const handler = rest.patch(
  `/conditional_fields/squad_assignments/3`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
