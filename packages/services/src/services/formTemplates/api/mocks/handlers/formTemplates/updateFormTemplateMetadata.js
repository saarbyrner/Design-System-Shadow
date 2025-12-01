// @flow
import { rest } from 'msw';
import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/fetchFormTemplate';

const handler = rest.put(
  'forms/:form_id/form_templates/:form_template_id/update_form_only',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler };
