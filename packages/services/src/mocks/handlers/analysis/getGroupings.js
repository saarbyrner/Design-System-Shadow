import { rest } from 'msw';

const data = [
  {
    name: 'Grouping 1',
    groupings: ['grouping_1'],
  },
  {
    name: 'Grouping 2',
    groupings: ['grouping_2a', 'grouping_2b'],
  },
  {
    name: 'Grouping 3',
    groupings: ['grouping_3a', 'grouping_3b', 'grouping_3c'],
  },
];

const handler = rest.get(
  '/reporting/charts/data_source_groupings',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
