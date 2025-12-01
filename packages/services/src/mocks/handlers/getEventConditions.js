import { rest } from 'msw';

const data = {
  surface_qualities: [
    {
      id: 1,
      title: 'Dry',
    },
    {
      id: 2,
      title: 'Wet',
    },
  ],
  surface_types: [
    {
      id: 1,
      name: 'Grass',
    },
    {
      id: 2,
      name: 'Synthetic',
    },
  ],
  weather_conditions: [
    {
      id: 1,
      title: 'Sunny',
    },
    {
      id: 2,
      title: 'Cloudy',
    },
  ],
  temperature_units: '°C',
};
const handler = rest.get('/event_conditions', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
