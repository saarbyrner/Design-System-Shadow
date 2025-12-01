import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Agility',
  },
  {
    id: 2,
    name: 'Strength',
  },
];
const handler = rest.get('/session_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
