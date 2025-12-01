import { rest } from 'msw';

const data = {
  games: [
    {
      game_date: '2021-04-14T00:00:00+01:00',
      name: 'International Squad vs Samoa (14/04/2021) 15-8',
      value: 47576,
    },
    {
      game_date: '2021-03-17T00:00:00+00:00',
      name: 'International Squad vs Australia (17/03/2021) 50-20',
      value: 38628,
    },
  ],
  training_sessions: [
    {
      name: 'Conditioning (04/05/2021)',
      value: 505729,
    },
  ],
  other_events: [
    {
      id: 1,
      label: 'Nonsport event',
      shortname: 'nonsport',
      sport: null,
    },
  ],
};

const handler = rest.get(
  '/athletes/:athleteId/injuries/game_and_training_options',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
