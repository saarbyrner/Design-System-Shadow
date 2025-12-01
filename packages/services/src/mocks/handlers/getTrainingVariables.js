import { rest } from 'msw';

const data = {
  training_variables: [
    {
      id: 18644,
      name: 'CMJ - Flight Time',
      description: null,
      perma_id: 'benchmarking_cmj___flight_time',
      variable_type_id: 1,
      min: null,
      max: null,
      invert_scale: false,
    },
    {
      id: 18883,
      name: 'G And M Av Seated Height',
      description: null,
      perma_id: 'g_and_m_av_seated_height',
      variable_type_id: 1,
      min: null,
      max: null,
      invert_scale: false,
    },
  ],
};

const handler = rest.post('/training_variables/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
