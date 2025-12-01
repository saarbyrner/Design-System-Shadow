import { rest } from 'msw';
import { documentData } from './mocks/documents.mocks';

const handler = rest.patch(
  `/medical/document_v2s/${documentData.document.id}/archive`,
  (req, res, ctx) => res(ctx.json(documentData))
);

export { handler, documentData };
