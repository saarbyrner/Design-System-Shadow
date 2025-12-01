import { rest } from 'msw';
import archiveAttachmentResponse from './mocks/attachments.mock';

const handler = rest.patch(
  '/attachments/:attachmentId/archive',
  (req, res, ctx) => res(ctx.json(archiveAttachmentResponse))
);

export { handler, archiveAttachmentResponse };
