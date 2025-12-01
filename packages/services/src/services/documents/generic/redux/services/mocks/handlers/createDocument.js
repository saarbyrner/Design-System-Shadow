// @flow
import { rest } from 'msw';

import { GENERIC_DOCUMENTS_CREATE_ENDPOINT } from '@kitman/services/src/services/documents/generic/redux/services/apis/createDocument';
import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';

const handler = rest.post(GENERIC_DOCUMENTS_CREATE_ENDPOINT, (req, res, ctx) =>
  res(ctx.json(data.documents[0]))
);

export { handler };
