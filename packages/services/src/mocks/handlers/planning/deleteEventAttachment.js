// @flow
import { rest } from 'msw';

const handler = rest.delete(
  `/planning_hub/events/:eventId/attachments/:attachmentId`,
  (req, res, ctx) => res(ctx.status(200))
);

export { handler };
