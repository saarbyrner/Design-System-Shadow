import { rest } from 'msw';
import data from '../data/mock_update_user_registration_status';

const handler = rest.put(
  '/registration/users/:userId/registrations/:registrationId/update_status',
  (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
