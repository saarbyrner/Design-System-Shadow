// @flow
import { rest } from 'msw';
import { createIssueEventUrl } from '@kitman/services/src/services/medical/createIssueEvent';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';

const data = {
  id: 394476,
  issue_occurrence_id: 132240,
  issue_occurrence_type: 'injury',
  injury_status_id: 4,
  event_date: '2025-08-08T05:00:00-05:00',
};

const handler = rest.post(createIssueEventUrl, (req, res, ctx) => {
  return res(ctx.status(statusCodes.ok), ctx.json(data));
});

export { handler, data };
