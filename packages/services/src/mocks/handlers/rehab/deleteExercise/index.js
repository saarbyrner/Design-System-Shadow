import { rest } from 'msw';
import data from './deleteData.mock';

const handler = rest.delete(
  '/ui/medical/rehab/session_exercises',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
