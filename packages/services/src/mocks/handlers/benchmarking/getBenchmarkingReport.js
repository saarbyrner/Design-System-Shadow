import { rest } from 'msw';

const nationalAthletes = [
  {
    athlete_name: null,
    label: 'my label',
    age_group: 'U9',
    test: '10m Sprint',
    athletes: 1,
    results: 2,
    mean: 377.5,
    min: 200.0,
    max: 555.0,
    result_type: 'national',
  },
];

const clubAthletes = [
  {
    athlete_name: null,
    label: 'my label',
    age_group: 'U23',
    test: '10m Sprint',
    athletes: 1,
    results: 2,
    mean: 665.5,
    min: 665.0,
    max: 666.0,
    result_type: 'my_club',
  },
  {
    athlete_name: null,
    label: 'my label',
    age_group: 'U23',
    test: '05m Sprint',
    athletes: 1,
    results: 1,
    mean: 666.0,
    min: 666.0,
    max: 666.0,
    result_type: 'my_club',
  },
];

const individualAthletes = [
  {
    athlete_name: 'alessandro',
    label: 'my label',
    age_group: null,
    test: '05m Sprint',
    athletes: 1,
    results: 1,
    mean: 666.0,
    min: 666.0,
    max: 666.0,
    result_type: 'individual',
  },
];

const data = [...nationalAthletes, ...clubAthletes, ...individualAthletes];

const dataClub = [...clubAthletes, ...individualAthletes];

const dataNational = [...nationalAthletes, ...individualAthletes];

const handler = rest.post('/benchmark/preview', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, dataClub, dataNational, handler };
