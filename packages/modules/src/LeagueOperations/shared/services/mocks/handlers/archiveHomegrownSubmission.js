// @flow
import { rest } from 'msw';

const response = {
  message: 'Submission archived',
};

const handler = rest.delete(
  '/registration/homegrown/archive',
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };
