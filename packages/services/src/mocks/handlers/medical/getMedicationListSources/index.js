import { rest } from 'msw';
import medicationListSourcesData from './data.mock';

const handler = rest.get(
  '/ui/medical/medications/organisation_medication_list_sources',
  (req, res, ctx) => {
    return res(ctx.json(medicationListSourcesData));
  }
);

export { handler, medicationListSourcesData };
