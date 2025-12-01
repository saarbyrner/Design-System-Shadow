// @flow
import { rest } from 'msw';
import { apiActivityMock } from './mock';

const handler = rest.get(
  '/ui/planning_hub/events/:eventId/game_activities',
  (req, res, ctx) => res(ctx.json(apiActivityMock))
);

export default handler;
