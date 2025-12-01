// @flow

import { rest } from 'msw';

import type { GetOfficialUsersResponse } from '@kitman/services/src/services/planning/getOfficialUsers';

const data: GetOfficialUsersResponse = [
  {
    id: 1,
    firstname: 'First',
    lastname: 'Last',
    fullname: 'First Last',
  },
  {
    id: 2,
    firstname: 'Second',
    lastname: 'Lastly',
    fullname: 'Second Lastly',
  },
];

const handler = rest.get('/users/official_only', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
