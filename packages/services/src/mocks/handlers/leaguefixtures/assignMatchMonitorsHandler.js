import { rest } from 'msw';

const data = {
  message: 'Monitors  Assigned',
};

const handler = rest.post(
  `/planning_hub/events/:event_id/game_match_monitors`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
