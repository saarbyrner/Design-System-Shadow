// @flow
import { rest } from 'msw';
import { CREATE_FORM_ANSWERS_SET_ROUTE } from '@kitman/services/src/services/humanInput/api/genericForms/createFormAnswersSet';
import { humanInputFormMockData as data } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';

const handler = rest.post(CREATE_FORM_ANSWERS_SET_ROUTE, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
