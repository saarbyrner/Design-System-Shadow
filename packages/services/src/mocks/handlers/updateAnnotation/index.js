import { rest } from 'msw';
import data from './data.mock';

const handler = rest.put('/medical/notes/:noteId', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
