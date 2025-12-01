import { rest } from 'msw';

const data = ['U13', 'U14', 'U15', 'U16', 'U17', 'U19'];

const handler = rest.get('/ui/squads/age_groups', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
