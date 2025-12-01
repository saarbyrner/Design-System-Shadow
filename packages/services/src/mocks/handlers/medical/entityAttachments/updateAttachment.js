import { rest } from 'msw';
import updateAttachmentResponse from './mocks/attachments.mock';

const handler = rest.patch('/attachments/:attachmentId', (req, res, ctx) =>
  res(ctx.json(updateAttachmentResponse))
);

export { handler, updateAttachmentResponse };
