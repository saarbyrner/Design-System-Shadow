// @flow
import { rest } from 'msw';

const data = {
  attached_link_id: 170,
  event_id: 9136500,
  id: 90,
  organisation_id: 6,
};

const handler = rest.delete(
  `/planning_hub/events/:eventId/attached_links/:attachedLinkId`,
  (req, res, ctx) => res(ctx.json(data))
);

export { data, handler };
