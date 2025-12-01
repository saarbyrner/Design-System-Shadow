// @flow
import { rest } from 'msw';

import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/fetchFormAssignments';

const handler = rest.get('/forms/:formId/assignments', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
