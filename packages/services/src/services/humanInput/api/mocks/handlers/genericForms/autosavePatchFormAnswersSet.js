// @flow
import { rest } from 'msw';

import { humanInputFormMockData as data } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';

const handler = rest.patch(
  '/forms/form_answers_sets/:formAnswersSetId/bulk_update',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
