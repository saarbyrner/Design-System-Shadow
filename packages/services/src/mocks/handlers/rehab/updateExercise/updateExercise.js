import { rest } from 'msw';
import data from './updateData.mock';

const handler = rest.put(
  '/ui/medical/rehab/session_exercises',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
