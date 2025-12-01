import { rest } from 'msw';

const data = {
  report_count: 2,
  message_count: 1,
};
const handler = rest.get(
  '/ui/medical/drfirst/notification_counts',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
