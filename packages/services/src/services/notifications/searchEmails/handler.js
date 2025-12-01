// @flow
import { rest } from 'msw';
import { mockEmailLogs } from './mock';
import { SEARCH_EMAIL_LOGS_URL } from '.';

const handler = rest.post(SEARCH_EMAIL_LOGS_URL, (req, res, ctx) => {
  return res(ctx.json(mockEmailLogs));
});

export default handler;
