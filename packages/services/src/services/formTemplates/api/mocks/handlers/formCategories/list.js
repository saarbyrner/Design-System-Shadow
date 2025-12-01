// @flow
import { rest } from 'msw';

import { paginatedFormCategoriesData as data } from '@kitman/services/src/services/formTemplates/api/mocks/data/formCategories.mock';

const handler = rest.get('/forms/categories', (req, res, ctx) =>
  res(ctx.json(null))
);

export { handler, data };
