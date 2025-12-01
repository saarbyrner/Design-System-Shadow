// @flow
import { rest } from 'msw';

const handler = rest.put('/settings/organisation_switcher', (req, res, ctx) =>
  res(ctx.status(200))
);

export { handler };
