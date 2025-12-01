// @flow
import { rest } from 'msw';
import mock from './mock';
import { getClubSquadsUrl } from '.';

const handler = rest.get(getClubSquadsUrl(':id'), async (req, res, ctx) =>
  res(ctx.json(mock))
);

export default handler;
