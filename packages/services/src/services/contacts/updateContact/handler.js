// @flow
import { rest } from 'msw';
import { GAME_CONTACTS } from '.';
import mock from './mock';

const handler = rest.patch(`${GAME_CONTACTS}/:id`, async (req, res, ctx) =>
  res(ctx.json(mock))
);

export default handler;
