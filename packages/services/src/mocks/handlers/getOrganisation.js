import { rest } from 'msw';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';

const data = {
  id: 1,
  name: 'Arsenal',
  logo_full_path: '',
  coding_system_key: codingSystemKeys.OSICS_10,
};

const handler = rest.get(
  '/ui//organisation/organisations/:id',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
