import { rest } from 'msw';

const data = {
  url: 'https://pmastg.premierleague.com/CCS/Dashboard?orgId=6&squadId=8&kitmanUserId=153723&cid=IP',
};

const handler = rest.get('/symbiosis_link', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
