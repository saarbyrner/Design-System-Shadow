// @flow
import { rest } from 'msw';

import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/fetchFormTemplate';

const handler = rest.get(
  '/forms/form_templates/:formTemplateId',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
