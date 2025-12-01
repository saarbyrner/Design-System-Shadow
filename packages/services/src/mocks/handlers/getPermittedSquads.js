import { rest } from 'msw';

const data = [
  { id: 1, name: 'First Squad' },
  { id: 2, name: 'Second Squad' },
  { id: 2731, name: 'Id Longer Than 1' },
];

const handler = rest.get('/ui/squads/permitted', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
