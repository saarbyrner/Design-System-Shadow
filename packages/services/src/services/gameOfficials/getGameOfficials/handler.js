// @flow
import { rest } from 'msw';
import mock from '@kitman/modules/src/MatchDay/shared/mock';

const handler = rest.get(
  '/planning_hub/events/:eventId/game_officials',
  (req, res, ctx) => res(ctx.json(Object.values(mock.gameOfficials)))
);

export default handler;
