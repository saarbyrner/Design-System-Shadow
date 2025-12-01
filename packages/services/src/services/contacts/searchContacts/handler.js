// @flow
import { rest } from 'msw';
import mock from './mock';
import { SEARCH_CONTACTS_URL } from '.';

const handler = rest.post(SEARCH_CONTACTS_URL, (req, res, ctx) =>
  res(ctx.json(mock))
);

export default handler;
