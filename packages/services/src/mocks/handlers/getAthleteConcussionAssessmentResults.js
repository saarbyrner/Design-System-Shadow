import { rest } from 'msw';

const data = [];

const handler = rest.get(
  '/medical/athletes/:athleteId/injuries/:issueId/concussions/assessments',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
