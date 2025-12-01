// @flow
import { rest } from 'msw';

const handler = rest.delete(
  '/forms/form_answers_sets/:formAnswersSetId',
  (req, res, ctx) => res(ctx.status(200))
);

export { handler };
