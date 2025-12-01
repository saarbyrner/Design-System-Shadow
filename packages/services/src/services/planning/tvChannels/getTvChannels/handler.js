// @flow
import { rest } from 'msw';
import { GET_TV_CHANNELS_URL } from '.';
import mock from './mock';

const handler = rest.get(GET_TV_CHANNELS_URL, async (req, res, ctx) =>
  res(ctx.json(mock))
);

export default handler;
