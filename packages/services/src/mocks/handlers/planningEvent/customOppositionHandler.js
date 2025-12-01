import { rest } from 'msw';

const data = { id: 5, name: 'Test Custom Name' };

const postHandler = rest.post('/custom_teams', (req, res, ctx) =>
  res(ctx.status(200))
);

const patchHandler = rest.patch('/custom_teams/:id', (req, res, ctx) =>
  res(ctx.status(200))
);

const deleteHandler = rest.delete('/custom_teams/:id', (req, res, ctx) =>
  res(ctx.status(200))
);

export { postHandler, patchHandler, deleteHandler, data };
