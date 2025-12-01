// @flow
import { rest } from 'msw';
import data from './data.mock';

const handler = rest.get(
  '/ui/medical/athletes/:athleteId/issue_occurrences',
  (req, res, ctx) => {
    const query = req.url.searchParams;
    const issueStatus = query.get('issue_status');
    const grouped = query.get('grouped');

    if (issueStatus === 'open') {
      return res(ctx.json(data.openIssues));
    }

    if (issueStatus === 'closed') {
      return res(ctx.json(data.closedIssues));
    }

    if (grouped) {
      return res(ctx.json(data.groupedIssues));
    }

    return res(ctx.json(data.allIssues));
  }
);

export { handler, data };
