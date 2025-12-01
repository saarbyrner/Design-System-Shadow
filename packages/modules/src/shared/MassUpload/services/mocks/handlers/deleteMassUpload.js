// @flow
import { rest } from 'msw';

const handler = rest.delete(
  `/settings/mass_upload/:attachment_id/:import_type`,
  (req, res, ctx) => res(ctx.json({}))
);

export default handler;
