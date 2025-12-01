import { rest } from 'msw';

const data = {
  id: 8,
  name: 'International Squad',
  owner_id: 6,
  division: [
    {
      id: 1,
      name: 'KLS',
    },
  ],
};

const handler = rest.get('/ui/squads/active_squad', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
