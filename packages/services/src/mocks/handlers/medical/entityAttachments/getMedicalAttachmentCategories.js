import { rest } from 'msw';
import medicalAttachmentCategories from './mocks/getMedicalAttachmentCategories.mock';

const handler = rest.get(`/ui/medical_attachment_categories`, (req, res, ctx) =>
  res(ctx.json(medicalAttachmentCategories))
);

export { handler, medicalAttachmentCategories };
