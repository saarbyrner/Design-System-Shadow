// @flow
import { rest } from 'msw';

const data = [
  {
    firstname: 'Official',
    lastname: '1',
    email: 'official1@email.com',
    date_of_birth: '1998-08-09',
    is_active: true,
  },
];

const handler = rest.post('/settings/officials', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
