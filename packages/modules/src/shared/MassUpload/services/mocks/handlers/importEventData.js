import { rest } from 'msw';

const data = {
  success: true,
  location: '/workloads/training_sessions/2651254?refresh=true',
};

const handler = rest.post(
  '/workloads/import_workflow/perform',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
