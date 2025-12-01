// @flow
import { rest } from 'msw';

import data from './mock';

const handler = rest.post(
  '/planning_hub/events/:eventId/athlete_events/update_attributes',
  (req, res, ctx) => res(ctx.json(data))
);

export default handler;
