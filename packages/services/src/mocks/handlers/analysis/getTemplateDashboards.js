import { rest } from 'msw';

const data = [
  {
    id: 'coaching',
    name: 'Coaching',
    mobile: false,
  },
  {
    id: 'medical',
    name: 'Medical',
    mobile: false,
  },
  {
    id: 'senior_mgmt',
    name: 'Senior Management',
    mobile: false,
  },
  {
    id: 'performance_clock',
    name: 'Performance Clock',
    mobile: true,
  },
];

const handler = rest.get('/reporting/template_dashboards', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
