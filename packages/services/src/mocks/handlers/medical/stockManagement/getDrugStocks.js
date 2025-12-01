import { rest } from 'msw';
import { mockedDrugStocks as data } from './data.mock';

const handler = rest.get('/medical/fdb/dispensable_drugs', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
