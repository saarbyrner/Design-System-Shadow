import { rest } from 'msw';
import data from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues/data.mock';

const handler = rest.get(
  '/ui/medical/athletes/:athleteId/issue_occurrences/continuation_grouped_issues',
  (req, res, ctx) => {
    return res(ctx.json(data.groupedDetailedEnrichedIssues));
  }
);

export { handler, data };
