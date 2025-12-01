// @flow
import { rest } from 'msw';

const response = {
  message: 'Notification sent',
};

const handler = rest.post(
  '/registration/homegrown/notification',
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };
