import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Coached',
    archived: false,
  },
  {
    id: 2,
    name: 'Practised',
    archived: false,
  },
  {
    id: 3,
    name: 'Initialized',
    archived: true,
  },
];

const handler = rest.get(
  '/ui/planning_hub/development_goal_completion_types',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
