// @flow
import { rest } from 'msw';
import mock from '@kitman/services/src/services/planning/createLeagueFixture/mock';

const handler = rest.patch(
  '/planning_hub/league_games/:eventId',
  (req, res, ctx) => res(ctx.json(mock))
);

export default handler;
