import { rest } from 'msw';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';

import { NHSDrugs, FDBDrugs, CustomDrugs } from './data.mock';

const handler = rest.post('/medical/drugs/search', async (req, res, ctx) => {
  const requestData = await req.json();
  switch (requestData.medication_list_source) {
    case 'nhs_dmd_drugs':
      return res(ctx.json(NHSDrugs));
    case 'fdb_dispensable_drugs':
      return res(ctx.json(FDBDrugs));
    case 'custom_drugs':
      return res(ctx.json(CustomDrugs));
    default:
      return res(ctx.status(statusCodes.unprocessableEntity));
  }
});

export { handler, NHSDrugs, FDBDrugs, CustomDrugs };
