import { data as mockSquadData } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_squad_list';

import transformToSquadRows from '../utils';

describe('transformToSquadRows', () => {
  it('correctly parses a squad to a squad row object', () => {
    expect(transformToSquadRows([mockSquadData[0]])).toStrictEqual([
      {
        id: '645235245664daf0f8fccc44',
        name: {
          href: '/registration/squads?id=645235245664daf0f8fccc44',
          text: 'U13',
        },
        total_athletes: 12,
        total_coaches: 2,
      },
    ]);
  });
  it('correctly parses all the squad rows', () => {
    expect(transformToSquadRows(mockSquadData)).toHaveLength(3);
  });
});
