// @flow
import { rest } from 'msw';

import { CREATE_FORM_TEMPLATES_URL } from '@kitman/services/src/services/formTemplates/api/formTemplates/create';

const handler = rest.post(CREATE_FORM_TEMPLATES_URL, (req, res, ctx) =>
  res(ctx.status(200))
);

export { handler };
