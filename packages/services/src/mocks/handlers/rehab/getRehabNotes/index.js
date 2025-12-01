import { rest } from 'msw';
import data from './getRehabNotesData.mock';

const handler = rest.post(
  '/ui/medical/rehab/sessions/annotations',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
