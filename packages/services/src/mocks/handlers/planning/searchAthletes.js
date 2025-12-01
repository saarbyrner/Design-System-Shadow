import { rest } from 'msw';

import { data } from './getAthleteEvents';

const handler = rest.post(
  '/planning_hub/events/:eventId/athlete_events/search',
  (_, res, ctx) => res(ctx.json(data.athlete_events))
);

export { handler, data };
