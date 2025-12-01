// @flow
import { rest } from 'msw';

const handler = rest.delete(
  '/planning_hub/events/1/game_monitor_reports',
  (req, res, ctx) => res(ctx.status(200))
);

export default handler;
