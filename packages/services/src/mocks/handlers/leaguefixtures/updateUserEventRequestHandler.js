import { rest } from 'msw';

const data = {
  message: 'request updated',
};

const handler = rest.patch(
  `/planning_hub/user_event_requests/:request_id`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
