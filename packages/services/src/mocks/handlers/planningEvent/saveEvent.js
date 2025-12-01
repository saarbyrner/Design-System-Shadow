import { rest } from 'msw';

const data = null;

const postHandler = rest.post('/planning_hub/events', (req, res, ctx) =>
  res(ctx.status(200))
);

const patchHandler = rest.patch('/planning_hub/events/:id', (req, res, ctx) =>
  res(ctx.status(200))
);

export { postHandler, patchHandler, data };
