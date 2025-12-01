import { rest } from 'msw';

const handler = rest.patch('/medical/notes/:id/archive', (req, res, ctx) => {
  const { id } = req.params;
  return res(ctx.json({ id }));
});

export default handler;
