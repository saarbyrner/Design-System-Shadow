import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getUserSquadHistory';
import transformRosterHistoryRows from '../utils';

describe('transformRosterHistoryRows', () => {
  it('should correctly transform raw data into RosterHistoryRows format', () => {
    const expectedOutput = [
      {
        club: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=100&h=100',
            id: 961,
            text: 'KL Galaxy',
          },
        ],
        id: 961,
        joined: '15 Mar 2024',
        league: 'KLS Next',
        left: '18 Mar 2024',
        squad: 'U19',
      },
      {
        id: 1005,
        club: [
          {
            avatar_src: '',
            id: 1005,
            text: undefined,
          },
        ],
        joined: '18 Mar 2024',
        league: 'KLS Next',
        left: '19 Mar 2024',
        squad: '18',
      },
      {
        id: 1006,
        club: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=100&h=100',
            id: 1006,
            text: 'KL Galaxy',
          },
        ],
        squad: 'U16',
        joined: '18 Mar 2024',
        league: 'KLS Next',
        left: '-',
      },
    ];

    expect(transformRosterHistoryRows(serverResponse)).toEqual(expectedOutput);
  });
});
