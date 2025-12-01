import { rest } from 'msw';

const data = [
  [
    { value: 'lab', label: 'Lab' },
    { value: 'radiology', label: 'Radiology' },
  ],
];

const handler = rest.get('/medical/locations/result_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
