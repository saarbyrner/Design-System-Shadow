import { rest } from 'msw';

const data = [
  {
    default_value: null,
    description: 'accommodation',
    id: 22741,
    is_protected: false,
    scale_increment: '0.5',
    training_variable: [
      {
        description: '',
        id: 3443,
        invert_scale: false,
        max: 4,
        min: 1,
        name: 'Accommodation',
        perma_id: 'accommodation',
        variable_type_id: 6,
      },
    ],
  },
];

const handler = rest.get(
  '/ui/organisation_training_variables',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
