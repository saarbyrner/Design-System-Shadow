import { rest } from 'msw';

const data = [
  {
    id: 6287,
    name: 'Dashboard 1',
    layout: '{}',
    created_at: '2021-10-06T22:44:56.000+01:00',
    updated_at: '2021-10-06T22:44:56.000+01:00',
    squad_id: 8,
    print_paper_size: null,
    print_orientation: null,
  },
  {
    id: 6288,
    name: 'Dashboard 2',
    layout: '{}',
    created_at: '2021-10-06T22:44:56.000+01:00',
    updated_at: '2021-10-06T22:44:56.000+01:00',
    squad_id: 8,
    print_paper_size: null,
    print_orientation: null,
  },
  {
    id: 6289,
    name: 'Dashboard 3',
    layout: '{}',
    created_at: '2021-10-06T22:44:56.000+01:00',
    updated_at: '2021-10-06T22:44:56.000+01:00',
    squad_id: 8,
    print_paper_size: null,
    print_orientation: null,
  },
];

const handler = rest.get('/ui/squads/:id/dashboards', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
