import { rest } from 'msw';

const data = [
  {
    id: 1,
    user_id: 1,
    username: 'official1',
    email: 'official1@gmail.com',
    date_of_birth: '08/27/1998',
    firstname: 'Official',
    lastname: '1',
    fullname: 'Official 1',
  },
  {
    id: 2,
    user_id: 2,
    username: 'official2',
    email: 'official2@gmail.com',
    date_of_birth: '08/31/2002',
    firstname: 'Official',
    lastname: '2',
    fullname: 'Official 2',
  },
];

const handler = rest.post('/settings/officials/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
