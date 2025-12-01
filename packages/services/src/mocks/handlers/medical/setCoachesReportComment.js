import { rest } from 'msw';

const coachesReportsResponse = {
  id: 387,
  athlete_id: 40211,
  comment: 'comment here1',
  created_by_id: 139077,
  comment_date: '2023-07-21T23:00:00Z',
  created_at: '2023-07-22T16:19:40.119+01:00',
  updated_at: '2023-07-22T16:19:40.119+01:00',
  organisation_id: 6,
};

const data = {
  ...coachesReportsResponse,
};
const handler = rest.post(
  `/athletes/${coachesReportsResponse.id}/availability_comments`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
