import { rest } from 'msw';

const data = {
  url: 'https://drfirst.com/athlete/21/sample/auth/link',
};
const handler = rest.get('/ui/medical/drfirst/portal_url', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
