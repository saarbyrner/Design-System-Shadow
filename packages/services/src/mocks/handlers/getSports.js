import { rest } from 'msw';

const data = { id: 1, perma_id: 'soccer', name: 'Soccer', duration: 90 };
const handler = rest.get('/sports', (req, res, ctx) => res(ctx.json(data)));

export { handler, data };
