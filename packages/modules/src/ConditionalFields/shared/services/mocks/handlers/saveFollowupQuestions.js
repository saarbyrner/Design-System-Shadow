// @flow
import { rest } from 'msw';

import { data } from '../data/mock_version';

const handler = rest.patch(
  `/conditional_fields/rulesets/${data.id}/versions/${data.version}/questions/${data.conditions[0].questions[0].question.id}/create_child_questions`,
  (req, res, ctx) => res(ctx.json(data.conditions[0]))
);

export { handler, data };
