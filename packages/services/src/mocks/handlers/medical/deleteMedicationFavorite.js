import { rest } from 'msw';

const handler = rest.delete(
  '/ui/medical/medication_favorites/:medicationFavoriteId',
  (req, res, ctx) => res(ctx.status(200))
);

export default handler;
