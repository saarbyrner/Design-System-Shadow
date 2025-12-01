import { rest } from 'msw';

const data = {
  id: 1,
  user: {
    id: 171171,
    firstname: 'Ted',
    lastname: 'Burger',
    fullname: 'Ted Burger-admin-eu',
  },
  event: {
    id: 2694210,
    start_date: '2024-05-23T10:30:00Z',
    squad: {
      id: 8,
      name: 'International Squad',
    },
  },
  status: 'pending',
  reason: null,
};

const handler = rest.post(
  `/planning_hub/user_event_requests`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
