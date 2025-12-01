// @flow
import { rest } from 'msw';

const handler = rest.put(
  '/planning_hub/events/:eventId/game_officials/bulk_save',
  (req, res, ctx) =>
    res(ctx.json({ game_officials: [{ official_id: 1, role: 'referee' }] }))
);

export default handler;
