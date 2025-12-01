import { rest } from 'msw';

const data = {
  athletes: [
    {
      id: 2039,
      fullname: 'Altenwerth, Myrna',
    },
    {
      id: 37335,
      fullname: 'Smitham, Myrna',
    },
  ],
};

const handler = rest.post(
  '/medical/rosters/search_past_athletes',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
