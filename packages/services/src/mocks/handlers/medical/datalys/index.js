import { rest } from 'msw';
import data from './data.mock';

const getDatalysClassificationHandler = rest.get(
  '/ui/medical/datalys_classifications',
  (req, res, ctx) => res(ctx.json(data.datalys_classifications))
);

const getDatalysBodyAreaHandler = rest.get(
  '/ui/medical/datalys_body_areas',
  (req, res, ctx) => res(ctx.json(data.datalys_body_areas))
);

export { getDatalysClassificationHandler, getDatalysBodyAreaHandler, data };
