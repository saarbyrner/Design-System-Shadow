import { rest } from 'msw';

const data = {
  period_term: 'Custom Period',
  periods: [{ id: 456, name: 'First Half', duration: 40, order: 2 }],
};

const handler = rest.get('/ui/associations/current', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
