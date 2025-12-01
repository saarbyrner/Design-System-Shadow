import { rest } from 'msw';
import fileTypes from './mocks/getMedicalAttachmentFileTypes.mock';

const fullResponse = { file_types: fileTypes };
const handler = rest.get(`/ui/file_types`, (req, res, ctx) =>
  res(ctx.json(fullResponse))
);

export { handler, fullResponse };
