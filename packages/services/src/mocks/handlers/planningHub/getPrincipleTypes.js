import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Tecnical',
  },
  {
    id: 2,
    name: 'Tactical',
  },
];
const handler = rest.get('/ui/planning_hub/principle_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
