// @flow
import { rest } from 'msw';

import { GET_CATEGORIES_ROUTE } from '@kitman/services/src/services/formTemplates/api/formTemplates/getCategories';
import { formCategoriesSelectMock as data } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/getCategories';

const handler = rest.get(GET_CATEGORIES_ROUTE, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
