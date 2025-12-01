// @flow
import { rest } from 'msw';
import mock from './mock';

const handler = rest.post(
  `/planning_hub/events/:eventId/event_game_contacts/bulk_save`,
  (req, res, ctx) => res(ctx.json(mock))
);

export default handler;
