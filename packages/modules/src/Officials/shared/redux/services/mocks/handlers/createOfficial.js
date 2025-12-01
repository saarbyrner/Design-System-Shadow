// @flow
import { rest } from 'msw';

import { data } from '../data/mock_official_list';

const createOfficial = {
  firstname: data[0].firstname,
  lastname: data[0].lastname,
  email: data[0].email,
  date_of_birth: data[0].date_of_birth,
  is_active: true,
};

const handler = rest.post('/settings/officials', (req, res, ctx) =>
  res(ctx.json(createOfficial))
);

export { handler, data };
