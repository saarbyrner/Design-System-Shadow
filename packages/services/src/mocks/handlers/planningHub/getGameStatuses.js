import { rest } from 'msw';

const data = {
  'Awaiting Officials': 'awaiting_officials',
};

const handler = rest.get('/ui/planning_hub/game_statuses', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
