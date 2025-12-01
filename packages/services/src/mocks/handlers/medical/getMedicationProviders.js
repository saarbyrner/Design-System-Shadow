import { rest } from 'msw';

const data = [
  { value: 'provider_dr_john', label: 'Dr. John' },
  { value: 'provider_claire_smith_md', label: 'Claire Smith MD' },
];

const handler = rest.post(
  '/ui/medical/medications/providers',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
