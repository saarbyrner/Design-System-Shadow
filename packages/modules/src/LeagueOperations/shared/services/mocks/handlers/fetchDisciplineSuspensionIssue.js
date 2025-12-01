// @flow
import { rest } from 'msw';
import { DISCIPLINE_SUSPENSION_RESPONSE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

const response = DISCIPLINE_SUSPENSION_RESPONSE;

const handler = rest.post('/discipline/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };
