// @flow
import { rest } from 'msw';
import { humanInputFormMockData as data } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';

const handler = rest.put(
  '/registration/users/:user_id/update_profile',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
