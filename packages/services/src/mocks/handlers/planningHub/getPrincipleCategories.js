import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Passing',
  },
  {
    id: 2,
    name: 'Possession of the ball',
  },
];
const handler = rest.get(
  '/ui/planning_hub/principle_categories',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
