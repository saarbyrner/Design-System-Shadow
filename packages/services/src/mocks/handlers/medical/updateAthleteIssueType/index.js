import { rest } from 'msw';
import { mockedIssue } from '@kitman/modules/src/Medical/shared/services/getAthleteIssue';

const data = mockedIssue;

const handler = rest.patch(
  '/athletes/123/issues/issues_type_update',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
