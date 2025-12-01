import { rest } from 'msw';

const data = { name: 'Surface 1', id: 1 };

const handler = rest.get(
  '/ui/activity_locations/:eventId/surface_type',
  (req, res, ctx) => {
    const { eventId } = req.params;
    return res(ctx.json(eventId === '100' ? null : data));
  }
);

export { handler, data };
