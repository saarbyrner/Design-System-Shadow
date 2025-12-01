import { rest } from 'msw';
import { url as getDrugFormsUrl } from '@kitman/services/src/services/medical/medications/getDrugForms';
import { url as getMedStrengthUnitsUrl } from '@kitman/services/src/services/medical/medications/getMedStrengthUnits';
import { drugFormsMock, medStrengthUnitsMock } from './data.mock';

const geDrugFormsHandler = rest.get(getDrugFormsUrl, (req, res, ctx) => {
  return res(ctx.json(drugFormsMock));
});

const getMedStrengthUnitHandler = rest.get(
  getMedStrengthUnitsUrl,
  (req, res, ctx) => {
    return res(ctx.json(medStrengthUnitsMock));
  }
);

const handlers = [getMedStrengthUnitHandler, geDrugFormsHandler];
export { handlers, drugFormsMock, medStrengthUnitsMock };
