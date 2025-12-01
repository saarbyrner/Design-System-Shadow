// @flow
import { rest } from 'msw';

import { GET_QUESTION_BANKS_ROUTE } from '@kitman/services/src/services/formTemplates/api/formBuilder/getQuestionBanks';
import { numberData as data } from '@kitman/services/src/services/formTemplates/api/mocks/data/formBuilder/getQuestionBanks';

const handler = rest.get(GET_QUESTION_BANKS_ROUTE, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
