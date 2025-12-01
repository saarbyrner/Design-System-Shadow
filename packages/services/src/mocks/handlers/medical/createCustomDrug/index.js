import { rest } from 'msw';
import { createCustomDrugResponse as data } from './data.mock';

const handler = rest.post(
  '/medical/drugs/custom_drugs',
  async (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
