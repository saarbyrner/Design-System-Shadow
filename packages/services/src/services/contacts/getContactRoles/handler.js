// @flow
import { rest } from 'msw';
import mock from './mock';
import { GET_CONTACT_ROLES_URL } from '.';

const handler = rest.get(GET_CONTACT_ROLES_URL, (req, res, ctx) =>
  res(ctx.json(mock))
);

export default handler;
