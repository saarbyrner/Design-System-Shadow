import { rest } from 'msw';

const data = {
  organisation: {
    id: 6,
    name: 'Kitman Rugby Club',
  },
  season: 2011,
  testing_window: {
    id: 5,
    name: 'Test Window 1',
  },
  training_variables: [
    {
      id: 16340,
      name: '05m Sprint',
    },
    {
      id: 16341,
      name: '10m Sprint',
    },
    {
      id: 16342,
      name: '20m Sprint',
    },
    {
      id: 16343,
      name: '30m Sprint',
    },
  ],
  age_group_seasons: [
    {
      id: 223,
      name: 'U9',
    },
    {
      id: 237,
      name: 'U10',
    },
    {
      id: 251,
      name: 'U11',
    },
    {
      id: 265,
      name: 'U12',
    },
    {
      id: 279,
      name: 'U13',
    },
    {
      id: 293,
      name: 'U14',
    },
    {
      id: 307,
      name: 'U15',
    },
  ],
  validated_training_variables: [
    {
      age_group_season_id: 223,
      training_variable_ids: [16340, 16341, 16342, 16343],
    },
  ],
};

const handler = rest.post('/benchmark/validations', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, handler };
