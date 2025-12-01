import { rest } from 'msw';

const data = [
  {
    id: 2,
    code: 'KD901',
    name: 'ACL Surgery',
    intravenous: false,
  },
  {
    id: 4,
    code: 'TB090',
    name: 'Tibia Reconstruction',
    intravenous: true,
  },
  {
    id: 5,
    code: 'CO901',
    name: 'Concussion Assessment',
    intravenous: false,
  },
];

const handler = rest.get(
  '/medical/procedures/procedure_types',
  (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
