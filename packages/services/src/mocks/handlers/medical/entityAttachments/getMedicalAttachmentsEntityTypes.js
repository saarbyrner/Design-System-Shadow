import { rest } from 'msw';
import entityTypes from './mocks/getMedicalAttachmentsEntityTypes.mock';

const fullResponse = { entity_types: entityTypes };
const handler = rest.get(
  `/ui/medical/entity_attachments/entity_types`,
  (req, res, ctx) => res(ctx.json(fullResponse))
);

export { handler, fullResponse };
