import { rest } from 'msw';

const mockData = [
  {
    Id: 2351,
    KitmanTeamId: 11,
    StartDate: '2023-08-08T23:00:00Z',
    EndDate: '2023-08-10T23:00:00Z',
    Name: 'Test Child event Oz 08.08.2023',
    Description: '',
    Team: {
      Id: 1000001,
      Name: 'U18',
      Order: 1,
      ClubId: 101,
      Club: null,
      OptaTeamId: null,
      IsFirstTeam: true,
      TeamType: 18,
      IsHiddenFromClub: false,
    },
    IsShared: false,
    Fixtures: null,
  },
];

const handler = rest.post('/calendar/tso_events', (req, res, ctx) =>
  res(ctx.json(mockData))
);

export { handler, mockData };
