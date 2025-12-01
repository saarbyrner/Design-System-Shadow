import { rest } from 'msw';
import { SEARCH_BY_ATHLETE_URL } from '../../searchByAthlete';
import { data } from '../data/searchByAthlete';

const handler = rest.post(SEARCH_BY_ATHLETE_URL, (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
