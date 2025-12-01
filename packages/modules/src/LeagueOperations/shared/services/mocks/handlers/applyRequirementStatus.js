// @flow
import { rest } from 'msw';

const data = {
  id: 1,
  status: 'pending_organisation',
  created_at: '2024-07-08',
  current_status: true,
  annotations: [{ annotation_date: '', content: 'An annotation' }],
};

const handler = rest.post(
  '/registration/registrations/:registration_id/sections/:section_id/status',
  (req, res, ctx) => res(ctx.status(data))
);

export { handler, data };
