import { rest } from 'msw';
import medicalIssuesCI from './data.mock';

const handler = rest.post('/ui/medical/issues/get', (req, res, ctx) => {
  return res(ctx.json(medicalIssuesCI));
});

export { handler, medicalIssuesCI };
