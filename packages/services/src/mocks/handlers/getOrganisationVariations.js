import { rest } from 'msw';

const data = {
  parameter1: [
    {
      type: 'count',
      key: 'sets',
      label: 'Sets',
      unit: 'no.',
      param_key: 'parameter1',
    },
  ],
  parameter2: [
    {
      type: 'count',
      key: 'circuits',
      label: 'Circuits',
      unit: 'no.',
      param_key: 'parameter2',
    },
    {
      type: 'count',
      key: 'jumps',
      label: 'Jumps',
      unit: 'no.',
      param_key: 'parameter2',
    },
  ],
  parameter3: [
    {
      type: 'intensity',
      key: 'air_pressure',
      label: 'Air pressure',
      unit: 'psi',
      param_key: 'parameter3',
    },
    {
      type: 'length',
      key: 'kilometers',
      label: 'Kilometers',
      unit: 'km',
      param_key: 'parameter3',
    },
    {
      type: 'intensity',
      key: 'kilometers_per_hour',
      label: 'Kilometers per hour',
      unit: 'kph',
      param_key: 'parameter3',
    },
    {
      type: 'count',
      key: 'laps',
      label: 'Laps',
      unit: 'no.',
      param_key: 'parameter3',
    },
    {
      type: 'intensity',
      key: 'level',
      label: 'Level',
      unit: null,
      param_key: 'parameter3',
    },
    {
      type: 'length',
      key: 'meters',
      label: 'Meters',
      unit: 'm',
      param_key: 'parameter3',
    },
    {
      type: 'length',
      key: 'miles',
      label: 'Miles',
      unit: 'mi',
      param_key: 'parameter3',
    },
  ],
};

const handler = rest.get(
  '/ui/organisation_exercise_variations',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
