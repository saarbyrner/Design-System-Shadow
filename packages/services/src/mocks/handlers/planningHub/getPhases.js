import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Attack',
  },
  {
    id: 2,
    name: 'Defence',
  },
];
const handler = rest.get('/ui/planning_hub/phases', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
