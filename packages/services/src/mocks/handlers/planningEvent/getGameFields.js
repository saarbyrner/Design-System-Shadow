import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: '11v11',
    columns: 11,
    rows: 11,
  },
];

const handler = rest.get('/ui/planning_hub/fields', (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
