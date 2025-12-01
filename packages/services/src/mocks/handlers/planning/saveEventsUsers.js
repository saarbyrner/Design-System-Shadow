import { rest } from 'msw';

const handler = rest.post(
  '/planning_hub/events/:eventId/user_attendance',
  async (req, res, ctx) => res(ctx.json('User attendance updated'))
);

export default handler;
