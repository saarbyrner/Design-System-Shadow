// @flow
import { rest } from 'msw';
import mock from './mock';

const handler = rest.patch(
  '/athletes/:athlete_id/diagnostics/:diagnostic_id',
  (req, res, ctx) => res(ctx.json(mock))
);

export default handler;
