// @flow
import { rest } from 'msw';

import { humanInputFormMockData as data } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';

const handler = rest.put(
  '/forms/form_answers_sets/:athleteId/bulk_update',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
