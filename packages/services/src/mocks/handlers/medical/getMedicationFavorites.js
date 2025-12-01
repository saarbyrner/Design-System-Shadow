import { rest } from 'msw';

const data = [
  {
    id: 6,
    directions: 'apply',
    dose: '1',
    dose_units: null,
    frequency: '3',
    route: 'by mouth',
    duration: 1,
    tapered: false,
  },
  {
    id: 2,
    directions: 'take',
    dose: '4',
    dose_units: null,
    frequency: '1',
    route: 'by mouth',
    duration: 2,
    tapered: false,
  },
  {
    id: 3,
    directions: null,
    dose: null,
    dose_units: null,
    frequency: null,
    route: 'by mouth',
    duration: 3,
    tapered: true,
  },
];

const handler = rest.get('/ui/medical/medication_favorites', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
