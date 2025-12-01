import { rest } from 'msw';

const data = [
  {
    id: 9,
    name: 'Field Type 1',
    surface_types: [
      {
        id: 37,
        name: 'Surface Comp 1',
      },
    ],
  },
  {
    id: 10,
    name: 'Field Type 2',
    surface_types: [
      {
        id: 40,
        name: 'Surface Comp 2',
      },
      {
        id: 41,
        name: 'Surface Comp 3',
      },
    ],
  },
  {
    id: 11,
    name: 'Field Type 3',
    surface_types: [
      {
        id: 43,
        name: 'Surface Comp 4',
      },
      {
        id: 44,
        name: 'Surface Comp 5',
      },
    ],
  },
];
const handler = rest.get('/surface_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
