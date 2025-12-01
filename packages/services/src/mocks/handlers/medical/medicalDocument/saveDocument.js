import { rest } from 'msw';
import { documentsResponse } from './mocks/documents.mocks';

const handler = rest.post(
  '/medical/document_v2s/bulk_create',
  (req, res, ctx) => res(ctx.json(documentsResponse))
);

export { handler, documentsResponse };
