import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Field Condition 1',
  },
  {
    id: 2,
    name: 'Field Condition 2',
  },
];
const handler = rest.get('/ui/field_conditions', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
