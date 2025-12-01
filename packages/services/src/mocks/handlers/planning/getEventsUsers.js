import { rest } from 'msw';

const data = [
  {
    id: 18,
    user: {
      id: 9624,
      firstname: 'Tiffany',
      lastname: 'Riley',
      fullname: 'Tiffany Riley',
    },
    event_activity_ids: [6],
  },
  {
    id: 29,
    user: {
      id: 1236,
      firstname: 'Stuart',
      lastname: "O'Brien",
      fullname: "Stuart O'Brien",
    },
    event_activity_ids: [4, 5, 6],
  },
  {
    id: 30,
    user: {
      id: 1654,
      firstname: 'Stephen',
      lastname: 'Smith',
      fullname: 'Stephen Smith',
    },
    event_activity_ids: [],
  },
];

const handler = rest.get(
  '/planning_hub/events/:eventId/events_users',
  (_, res, ctx) => res(ctx.json(data))
);

export { handler, data };
