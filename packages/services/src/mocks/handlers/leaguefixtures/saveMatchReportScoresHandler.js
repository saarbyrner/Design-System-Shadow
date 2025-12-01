import { rest } from 'msw';

const data = {
  message: 'Scores set',
};

const handler = rest.post(
  `/planning_hub/events/:event_id/set_scores`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
