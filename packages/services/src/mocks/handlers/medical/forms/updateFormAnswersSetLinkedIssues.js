import { rest } from 'msw';
import { URL } from '@kitman/services/src/services/medical/updateFormAnswersSetLinkedIssues';

const handler = rest.patch(URL, (req, res, ctx) => res(ctx.status(200)));

export default handler;
