import { rest } from 'msw';
import { documentData, archivedDocumentData } from './mocks/documents.mocks';

const handler = rest.get(
  `/medical/document_v2s/${documentData.id}`,
  (req, res, ctx) => res(ctx.json(documentData))
);

export { handler, documentData, archivedDocumentData };
