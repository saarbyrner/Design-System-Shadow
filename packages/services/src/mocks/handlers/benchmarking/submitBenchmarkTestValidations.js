import { rest } from 'msw';

const data = [
  { age_group_season_id: 223, training_variable_id: 16340 },
  { age_group_season_id: 223, training_variable_id: 16341 },
  { age_group_season_id: 223, training_variable_id: 16342 },
  { age_group_season_id: 223, training_variable_id: 16343 },
];

const handler = rest.post('/benchmark/validate', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, handler };
