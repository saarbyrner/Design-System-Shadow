// @flow
import { rest } from 'msw';
import mock from './mock';

const handler = rest.post(
  '/ui/planning_hub/events/:eventId/game_periods/bulk_save',
  (req, res, ctx) => res(ctx.json(mock))
);

export default handler;
