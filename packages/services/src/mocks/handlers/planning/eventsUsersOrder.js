/* eslint-disable camelcase */
// @flow
import { rest } from 'msw';

const data = {
  id: 2427413,
  user: {
    id: 284337,
    firstname: 'Jack-Faxx',
    lastname: 'Forciea',
    fullname: 'Jack-Faxx Forciea',
    email: 'jack.forciea+klgalaxy@mlsnextpro.com',
    avatar_url:
      'https://injpro-staging-public.s3-eu-west-1.amazonaws.com/klgalaxy/ed7d1bc3d4d6396e46397561c1cb104a.png',
    role: 'Staff',
  },
};

const handler = rest.post(
  '/planning_hub/events/:eventId/events_users/bulk_save',
  (req, res, ctx) => {
    const { users_order } = req.body;

    const response = users_order.map((user, index) => ({
      id: user.id,
      user: {
        ...user,
        order: index + 1,
      },
    }));

    return res(ctx.json(response));
  }
);

export { handler, data };
const handlers = [handler];

export default handlers;
