import { rest } from 'msw';

const data = {
  active: true,
  id: 64,
  registration_completable: true,
};

const handler = rest.get(
  '/registration/requirements/:requirement_id',
  (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
