/* eslint-disable camelcase */
import { rest } from 'msw';

export const userOnly = {
  id: 11111,
  firstname: 'Hacksaw Jim',
  lastname: 'Duggan',
  fullname: 'Hacksaw Jim Duggan',
  username: 'hacksawjim',
  email: 'hacksawjimduggan@kitmanlabs.com',
  date_of_birth: '12 Oct 1990',
};

export const withAthlete = {
  id: 2,
  fullname: 'Hacksaw Jim Duggan',
  position: 'striker',
  date_of_birth: '12 Oct 1990',
  organisations: [
    {
      id: 115,
      logo_full_path:
        'https://ssl.gstatic.com/onebox/media/sports/logos/udQ6ns69PctCv143h-GeYw_48x48.png',
      name: 'Manchester United',
    },
    {
      id: 116,
      logo_full_path:
        'https://ssl.gstatic.com/onebox/media/sports/logos/Th4fAVAZeCJWRcKoLW7koA_48x48.png',
      name: 'Real Madrid',
    },
  ],
  avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
};

const data = {
  userOnly,
  withAthlete,
};
const handler = rest.get('/users/:userId', (req, res, ctx) => {
  const { include_athlete } = req.params || false;
  switch (include_athlete) {
    case true:
      return res(
        ctx.json({
          ...userOnly,
          athlete: withAthlete,
        })
      );
    default:
      return res(ctx.json(userOnly));
  }
});

export { handler, data };
