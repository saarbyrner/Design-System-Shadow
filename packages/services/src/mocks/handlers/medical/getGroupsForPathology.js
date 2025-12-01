import { rest } from 'msw';

const data = ['concussion'];

const handler = rest.get(
  '/ui/medical/group_identifiers/search',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
