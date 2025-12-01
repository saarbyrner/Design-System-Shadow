import { rest } from 'msw';

const data = [
  {
    id: 1,
    absolute_duration_start: 0,
    absolute_duration_end: 90,
    duration: 90,
  },
];

const handler = rest.get(
  '/ui/planning_hub/events/:eventId/game_periods',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
