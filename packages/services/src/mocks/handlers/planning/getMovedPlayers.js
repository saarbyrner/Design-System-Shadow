import { rest } from 'msw';

const data = {
  moved_athletes: [
    {
      firstname: 'Test NFL',
      id: 1,
      lastname: 'Infra',
    },
    {
      firstname: 'Johnny',
      id: 2,
      lastname: 'Football',
    },
  ],
  player_movement_enabled: true,
};

const handler = rest.get(
  '/planning_hub/events/:eventId/moved_athletes',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
