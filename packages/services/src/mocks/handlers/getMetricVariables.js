import { rest } from 'msw';

const data = [
  {
    source_key: 'combination|%_difference',
    name: '% Difference',
    source_name: 'Combination',
    type: 'number',
    localised_unit: '',
  },
  {
    source_key: 'kitman:tv|3_min_bike_vo2_max',
    name: '3 min Bike - Vo2 Max',
    source_name: 'Training Variable',
    type: 'number',
    localised_unit: null,
    is_protected: false,
  },
  {
    source_key: 'kitman:stiffness_indication|abdominal',
    name: 'Abdominal',
    source_name: 'Stiffness',
    type: 'scale',
    localised_unit: '1-10',
  },
];

const handler = rest.get('/ui/metric_variables', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
