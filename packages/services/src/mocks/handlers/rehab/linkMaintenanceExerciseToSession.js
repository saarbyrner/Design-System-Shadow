import { rest } from 'msw';
import data from './data.mock';

const handler = rest.post(
  '/ui/medical/rehab/session_exercises/link',
  (req, res, ctx) => res(ctx.json({ success: true }))
);

export { handler, data };
