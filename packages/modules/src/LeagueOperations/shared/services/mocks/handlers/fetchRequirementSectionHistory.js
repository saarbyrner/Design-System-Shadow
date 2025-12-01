import { rest } from 'msw';

import { data } from './fetchRegistrationHistory';

const handler = rest.get(
  `/registration/registrations/:registration_id/sections/:section_id/history`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
