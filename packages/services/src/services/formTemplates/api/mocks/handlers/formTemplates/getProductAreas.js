// @flow
import { rest } from 'msw';

import { GET_PRODUCT_AREAS_URL } from '@kitman/services/src/services/formTemplates/api/formTemplates/getProductAreas';
import { productAreasMock as data } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/getProductAreas';

const handler = rest.get(GET_PRODUCT_AREAS_URL, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
