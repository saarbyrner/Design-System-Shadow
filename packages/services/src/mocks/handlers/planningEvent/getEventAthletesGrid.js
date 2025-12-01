import { rest } from 'msw';

const data = {
  columns: [],
  rows: [],
  nextId: -1,
};

const handler = rest.post(
  '/planning_hub/events/:eventId/athlete_tab',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
