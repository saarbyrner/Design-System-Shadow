// @flow
import { rest } from 'msw';
import mock from './mock';

const handler = rest.post(
  '/planning_hub/events/:id/generate_pdf',
  async (req, res, ctx) => res(ctx.json(mock))
);

export default handler;
