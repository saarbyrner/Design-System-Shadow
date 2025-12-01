// @flow
import { rest } from 'msw';

import { humanInputFormMockData as data } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import { BULK_CREATE_FORM_ANSWERS_SET_ROUTE } from '@kitman/services/src/services/humanInput/api/genericForms/bulkCreateFormAnswersSet';

const handler = rest.post(BULK_CREATE_FORM_ANSWERS_SET_ROUTE, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
