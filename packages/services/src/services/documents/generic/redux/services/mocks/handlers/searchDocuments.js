// @flow
import { rest } from 'msw';

import { GENERIC_DOCUMENTS_SEARCH_ENDPOINT } from '@kitman/services/src/services/documents/generic/redux/services/apis/searchDocuments';
import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';

const handler = rest.post(GENERIC_DOCUMENTS_SEARCH_ENDPOINT, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
