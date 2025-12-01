import { rest } from 'msw';

const data = {
  season_marker_range: ['2014-06-14T00:00:00.000Z', '2023-12-31T00:00:00.000Z'],
};

const handler = rest.get('/ui/initial_data_planning_hub', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
