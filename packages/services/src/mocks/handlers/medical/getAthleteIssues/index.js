import { rest } from 'msw';
import data from './data.mock';

const handlers = [
  rest.get(
    '/ui/medical/athletes/:athleteId/issue_occurrences',
    (req, res, ctx) => {
      const query = req.url.searchParams;
      const issueStatus = query.get('issue_status');
      const grouped = query.get('grouped');
      const detailed = query.get('detailed');
      const search = query.get('search');

      let filteredIssues = [];
      if (issueStatus === 'open') {
        filteredIssues = data.openIssues.issues.filter((issue) => {
          return search ? issue.full_pathology?.includes(search) : true;
        });

        return res(
          ctx.json({
            meta: data.openIssues.meta,
            issues: filteredIssues,
          })
        );
      }

      if (issueStatus === 'closed') {
        filteredIssues = data.closedIssues.issues.filter((issue) => {
          return search ? issue.full_pathology?.includes(search) : true;
        });
        return res(
          ctx.json({
            meta: data.closedIssues.meta,
            issues: filteredIssues,
          })
        );
      }

      if (issueStatus === 'archived') {
        filteredIssues = data.archivedIssues.issues.filter((issue) => {
          return search ? issue.full_pathology?.includes(search) : true;
        });
        return res(
          ctx.json({
            meta: data.archivedIssues.meta,
            issues: filteredIssues,
          })
        );
      }

      if (grouped) {
        if (detailed) {
          return res(ctx.json(data.groupedDetailedEnrichedIssues));
        }
        return res(ctx.json(data.groupedIssues));
      }

      return res(ctx.json(data.allIssues));
    }
  ),
  rest.get('/athletes/:athleteId/chronic_issues/search', (req, res, ctx) => {
    const query = req.url.searchParams;
    const grouped = query.get('grouped_response');
    return res(
      ctx.json(grouped ? data.groupedChronicIssues : data.chronicIssues)
    );
  }),
];

export { handlers, data };
