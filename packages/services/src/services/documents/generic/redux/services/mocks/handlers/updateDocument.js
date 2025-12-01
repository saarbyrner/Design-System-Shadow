// @flow
import { rest } from 'msw';

import { GENERIC_DOCUMENTS_UPDATE_ENDPOINT } from '@kitman/services/src/services/documents/generic/redux/services/apis/updateDocument';
import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';

const handler = rest.put(
  `${GENERIC_DOCUMENTS_UPDATE_ENDPOINT}/:id`,
  (req, res, ctx) => res(ctx.json(data.documents[0]))
);

export { handler };
