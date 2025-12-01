// @flow
import { rest } from 'msw';

import { GENERIC_CATEGORIES_SEARCH_ENDPOINT } from '@kitman/services/src/services/documents/generic/redux/services/apis/fetchGenericDocumentsCategories';
import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/fetchGenericDocumentsCategories';

const handler = rest.get(GENERIC_CATEGORIES_SEARCH_ENDPOINT, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
