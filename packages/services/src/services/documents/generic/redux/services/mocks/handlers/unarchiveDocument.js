import { rest } from 'msw';

const documentId = 123;

const handler = rest.post(
  `/generic_documents/${documentId}/unarchive`,
  (req, res, ctx) => res(ctx.json({}))
);

export { handler };
