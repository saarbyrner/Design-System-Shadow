import { rest } from 'msw';

const data = {};
const handler = rest.get('/i18n/en/translation.json', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
