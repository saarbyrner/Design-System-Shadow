import { rest } from 'msw';

const data = {
  organisation: { id: 1, name: 'Test Org', logo_full_path: null },
  squad: { id: 1, name: 'Test Squad' },
  athletes: [
    { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@test.com' },
  ],
};

const handler = rest.get('/settings/squads/:squadId', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler };
