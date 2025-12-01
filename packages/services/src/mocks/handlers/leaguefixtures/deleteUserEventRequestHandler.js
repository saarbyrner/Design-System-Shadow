import { rest } from 'msw';

const data = {
  message: 'request deleted',
};

const handler = rest.delete(
  `/planning_hub/user_event_requests/:request_id`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
