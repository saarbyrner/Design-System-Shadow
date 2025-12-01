import { rest } from 'msw';

const handler = rest.post(
  '/medical/athletes/:athleteId/ancillary_dates',
  (req, res, ctx) => res(ctx.status(200))
);

export default handler;
