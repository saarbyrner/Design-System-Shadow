// @flow
import { rest } from 'msw';

import { data } from '../data/assignees.mock';

const handler =
  data.screening_ruleset.current_version &&
  rest.get(
    `/conditional_fields/squad_assignments/${data.screening_ruleset.current_version}`,
    (req, res, ctx) => res(ctx.json(data))
  );
export { handler, data };
