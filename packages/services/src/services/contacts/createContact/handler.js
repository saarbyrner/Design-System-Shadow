// @flow
import { rest } from 'msw';
import { CREATE_CONTACT_URL } from '.';
import mock from './mock';

const handler = rest.post(CREATE_CONTACT_URL, async (req, res, ctx) =>
  res(ctx.json(mock))
);

export default handler;
