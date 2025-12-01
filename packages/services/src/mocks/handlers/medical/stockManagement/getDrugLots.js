import { rest } from 'msw';
import { mockedDrugLots as data } from './data.mock';

const handler = rest.post(`/medical/stocks/search_lots`, (req, res, ctx) =>
  res(ctx.json(data))
);
export { handler, data };
