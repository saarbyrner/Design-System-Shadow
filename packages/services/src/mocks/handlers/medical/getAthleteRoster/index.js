import { rest } from 'msw';
import { GET_ATHLETE_ROSTER_URL } from '@kitman/services/src/services/medical/getAthleteRoster';
import { data } from './data.mock';

const handler = rest.post(GET_ATHLETE_ROSTER_URL, (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
