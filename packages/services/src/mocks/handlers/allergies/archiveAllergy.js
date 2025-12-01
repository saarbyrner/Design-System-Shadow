import { rest } from 'msw';
import data from './data.mock';

const mockAllergy = data[0].allergies[0];
const response = { id: mockAllergy.id, archived: true };

const handler = rest.patch(
  `/ui/medical/allergies/${mockAllergy.id}/archive`,
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };
