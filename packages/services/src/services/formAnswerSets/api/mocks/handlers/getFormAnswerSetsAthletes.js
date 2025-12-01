// @flow
import { rest } from 'msw';
import { data } from '@kitman/services/src/services/formAnswerSets/api/mocks/data/getFormAnswerSetsAthletes';

const handler = rest.get(
  '/ui/forms/form_answers_sets/athletes',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
