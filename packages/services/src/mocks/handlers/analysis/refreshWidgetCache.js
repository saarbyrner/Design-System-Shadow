import { rest } from 'msw';

const data = true;
const handler = rest.get(
  `/table_containers/:tableContainerId/refresh_cache`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
