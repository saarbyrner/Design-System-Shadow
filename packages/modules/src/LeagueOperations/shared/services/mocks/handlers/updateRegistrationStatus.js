// @flow
import { rest } from 'msw';

const data = {
  id: 1,
  status: 'pending_league',
  created_at: '2024-07-08',
  annotations: [{ annotation_date: '', content: 'An annotation' }],
};

const handler = rest.post(
  '/registration/users/:user_id/registrations/:registration_id/status',
  (req, res, ctx) => res(ctx.status(data))
);

export { handler, data };
