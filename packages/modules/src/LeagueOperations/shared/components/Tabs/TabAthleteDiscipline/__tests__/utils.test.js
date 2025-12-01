import { data as mockDisciplineIssues } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_search_discipline';
import { DISCIPLINARY_STATUS_VALUE } from '@kitman/modules/src/LeagueOperations/shared/consts';

import transformToAthleteDisciplineRows from '../utils';

describe('transformToAthleteDisciplineRows', () => {
  it('correctly parses an discipline to a discipline row object with no suspensions', () => {
    expect(
      transformToAthleteDisciplineRows([mockDisciplineIssues[0]])
    ).toStrictEqual([
      {
        athlete: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
            href: '/registration/profile?id=16',
            id: 16,
            text: 'Roy Keane',
          },
        ],
        discipline_status: DISCIPLINARY_STATUS_VALUE.Eligible,
        id: 16,
        jersey_no: 16,
        organisations: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
            href: '/registration/organisations?id=1267',
            id: 1267,
            text: 'KL Galaxy',
          },
        ],
        red_cards: 0,
        squads: [
          {
            id: 1,
            name: 'U13',
          },
        ],
        suspended_until: '-',
        team: 'U13',
        total_suspensions: 0,
        yellow_cards: 0,
        active_discipline: null,
      },
    ]);
  });

  it('correctly parses an discipline to a discipline row object with active suspensions', () => {
    expect(
      transformToAthleteDisciplineRows([mockDisciplineIssues[1]])
    ).toStrictEqual([
      {
        athlete: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
            href: '/registration/profile?id=4',
            id: 4,
            text: 'Vinnie Jones',
          },
        ],
        discipline_status: DISCIPLINARY_STATUS_VALUE.Suspended,
        id: 4,
        jersey_no: 4,
        organisations: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
            href: '/registration/organisations?id=1267',
            id: 1267,
            text: 'KL Galaxy',
          },
        ],
        red_cards: 3,
        squads: [
          {
            id: 1,
            name: 'U13',
          },
        ],
        suspended_until: 'Jun 15, 2024',
        team: 'U13',
        total_suspensions: 1,
        yellow_cards: 8,
        active_discipline: null,
      },
    ]);
  });

  it('correctly parses all the discipline rows', () => {
    expect(transformToAthleteDisciplineRows(mockDisciplineIssues)).toHaveLength(
      5
    );
  });

  it('correctly parses an discipline to a discipline row object with suspensions when FF league-ops-discipline-area-v2 is ON and number_of_active_disciplines used', () => {
    window.getFlag = jest.fn().mockReturnValue(true);

    expect(
      transformToAthleteDisciplineRows([mockDisciplineIssues[3]])
    ).toStrictEqual([
      {
        athlete: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
            href: '/league-fixtures/discipline/5',
            id: 5,
            text: 'Test Test',
          },
        ],
        discipline_status: DISCIPLINARY_STATUS_VALUE.Suspended,
        id: 5,
        jersey_no: 5,
        organisations: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
            href: '/registration/organisations?id=1267',
            id: 1267,
            text: 'KL Galaxy',
          },
        ],
        red_cards: 0,
        squads: [
          {
            id: 1,
            name: 'U13',
          },
        ],
        suspended_until: 'Multiple (5)',
        team: 'U13',
        total_suspensions: 0,
        yellow_cards: 0,
        active_discipline: null,
      },
    ]);
  });
  it('correctly parses an discipline to a discipline row object with suspensions when FF league-ops-discipline-area-v2 is ON and show number of games in suspension', () => {
    window.getFlag = jest.fn().mockReturnValue(true);

    expect(
      transformToAthleteDisciplineRows([mockDisciplineIssues[4]])
    ).toStrictEqual([
      {
        athlete: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
            href: '/league-fixtures/discipline/5',
            id: 5,
            text: 'Test Test',
          },
        ],
        discipline_status: DISCIPLINARY_STATUS_VALUE.Suspended,
        id: 5,
        jersey_no: 5,
        organisations: [
          {
            avatar_src:
              'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
            href: '/registration/organisations?id=1267',
            id: 1267,
            text: 'KL Galaxy',
          },
        ],
        red_cards: 0,
        squads: [
          {
            id: 1,
            name: 'U13',
          },
        ],
        suspended_until: '2 games',
        team: 'U13',
        total_suspensions: 0,
        yellow_cards: 0,
        active_discipline: {
          kind: 'number_of_games',
          number_of_games: 2,
        },
      },
    ]);
  });
});
