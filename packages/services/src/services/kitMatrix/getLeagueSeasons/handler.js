// @flow
import { rest } from 'msw';
import leagueSeasons from './mock';

const handler = rest.get('/league_seasons', (req, res, ctx) =>
  res(ctx.json(leagueSeasons))
);

export default handler;
