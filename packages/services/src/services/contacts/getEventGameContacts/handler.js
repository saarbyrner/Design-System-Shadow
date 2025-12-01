// @flow
import { rest } from 'msw';
import mock from './mock';

const handler = rest.get(
  `/planning_hub/events/:eventId/event_game_contacts`,
  (req, res, ctx) => res(ctx.json(mock))
);

export default handler;
