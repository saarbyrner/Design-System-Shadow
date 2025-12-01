import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Physical',
  },
  {
    id: 2,
    name: 'Tactical',
  },
];
const handler = rest.get(
  '/ui/planning_hub/development_goal_types',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
