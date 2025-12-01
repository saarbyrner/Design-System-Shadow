// @flow
import { rest } from 'msw';

import { SEARCH_FORM_TEMPLATES_URL } from '@kitman/services/src/services/formTemplates/api/formTemplates/search';
import { formTemplateMocksSnakeCase as data } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/search';

const handler = rest.post(SEARCH_FORM_TEMPLATES_URL, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
