// @flow
import { rest } from 'msw';

import {
  data,
  paginationData,
} from '@kitman/services/src/services/humanInput/api/mocks/data/assignedForms/assignedForms.mock';

import { GET_FORM_ASSIGNMENTS_ROUTE } from '@kitman/services/src/services/humanInput/api/assignedForms/fetchAssignedForms';

const handler = rest.get(GET_FORM_ASSIGNMENTS_ROUTE, (req, res, ctx) =>
  res(ctx.json({ data, pagination: paginationData }))
);

export { handler, data };
