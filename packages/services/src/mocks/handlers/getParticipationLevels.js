import { rest } from 'msw';

const data = [
  {
    canonical_participation_level: 'full',
    id: 1,
    name: 'Started - Full Game',
  },
  {
    canonical_participation_level: 'none',
    id: 2,
    name: 'No Participation',
  },
];

const handler = rest.get('/participation_levels', (req, res, ctx) => {
  const url = new URL(req.url);
  const nonNone = url.searchParams.get('non_none');

  if (nonNone === 'true') {
    return res(
      ctx.json(
        data.filter((item) => item.canonical_participation_level !== 'none')
      )
    );
  }

  return res(ctx.json(data));
});

export { handler, data };
