import { rest } from 'msw';
import { mockedSavedDrugStock as data } from './data.mock';

const handler = rest.post('/medical/stocks/add', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
