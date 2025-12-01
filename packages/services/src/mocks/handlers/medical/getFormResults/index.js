// @flow
import { rest } from 'msw';
import data from './formResults.mock';

const handlerConcussion = rest.get(
  '/ui/concussion/form_answers_sets/:formId',
  (req, res, ctx) => res(ctx.json(data))
);

const handler = rest.get('/forms/form_answers_sets/:formId', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, handlerConcussion, data };
