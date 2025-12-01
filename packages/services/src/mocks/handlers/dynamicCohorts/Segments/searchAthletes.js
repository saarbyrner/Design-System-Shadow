// @flow
import { rest } from 'msw';
import baseSegmentsURL from '@kitman/services/src/services/dynamicCohorts/Segments/consts';

export const paginatedAthletesResponse = {
  athletes: [
    {
      id: 1,
      name: 'Test Athlete',
      avatar: '/testAthleteURL1',
    },
    {
      id: 2,
      name: 'Test Athlete 2',
      avatar: '/testAthleteURL2',
    },
    {
      id: 3,
      name: 'Test Athlete 3',
      avatar: '/testAthleteURL3',
    },
  ],
  next_id: null,
};

const handler = rest.post(
  `${baseSegmentsURL}/query_athletes`,
  (req, res, ctx) => res(ctx.json(paginatedAthletesResponse))
);

export default handler;
