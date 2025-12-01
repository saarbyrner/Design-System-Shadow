// @flow
import { rest } from 'msw';
import { data } from '@kitman/services/src/services/formAnswerSets/api/mocks/data/searchFreeAgents';

const handler = rest.post(
  '/forms/form_answers_sets/search_free_agents',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
