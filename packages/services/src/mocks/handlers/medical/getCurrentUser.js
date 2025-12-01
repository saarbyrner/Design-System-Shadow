import { rest } from 'msw';

const data = [
  {
    id: 1,
    firstname: 'Frank',
    lastname: 'Castle',
    fullname: 'Frank Castle',
  },
];
const handler = rest.get('/ui/current_user', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
