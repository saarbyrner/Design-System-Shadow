import { rest } from 'msw';
import data from './data.mock';

const getClassificationHandler = rest.get(
  '/ui/medical/clinical_impressions_classifications',
  (req, res, ctx) => res(ctx.json(data.clinical_impression_classifications))
);

const getBodyAreaHandler = rest.get(
  '/ui/medical/clinical_impressions_body_areas',
  (req, res, ctx) => res(ctx.json(data.clinical_impression_body_areas))
);

export { getClassificationHandler, getBodyAreaHandler, data };
