import { rest } from 'msw';
import { mockDrugs } from '../../../../../modules/src/Medical/shared/components/AddMedicationSidePanel/mocks/mockData';

const data = mockDrugs;

const handler = rest.post(
  '/medical/stocks/search_stock_drugs',
  (req, res, ctx) => res(ctx.json(data))
);
export { handler, data };
