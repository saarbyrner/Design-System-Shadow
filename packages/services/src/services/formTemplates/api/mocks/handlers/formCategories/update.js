// @flow
import { rest } from 'msw';

import { formCategoryData as data } from '@kitman/services/src/services/formTemplates/api/mocks/data/formCategories.mock';

const handler = rest.put('/forms/categories/:categoryId', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
