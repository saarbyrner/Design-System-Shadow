import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Home',
  },
  {
    id: 2,
    name: 'Away',
  },
  {
    id: 3,
    name: 'Neutral',
  },
];

const handler = rest.get('/venue_types', (req, res, ctx) => {
  if (req.body.nfl_session_venues) {
    // NFL sessions want to remove neutral from this response
    const filteredVenues = data.filter(({ name }) => name !== 'Neutral');
    return res(ctx.json(filteredVenues));
  }

  return res(ctx.json(data));
});

export { handler, data };
