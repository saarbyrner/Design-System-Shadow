import { rest } from 'msw';

const data = [
  { id: 1, number_of_players: 10, name: '2-3-3' },
  { id: 2, number_of_players: 11, name: '4-4-2' },
];

const handler = rest.get('/ui/planning_hub/formations', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
