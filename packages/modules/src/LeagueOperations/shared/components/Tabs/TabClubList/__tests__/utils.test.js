import { data as mockOrgData } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_organisations_list';
import { FALLBACK_DASH } from '@kitman/modules/src/LeagueOperations/shared/consts';

import transformToOrganisationRows from '../utils';

describe('transformToOrganisationRows', () => {
  it('correctly parses an organisation to an organisation row object', () => {
    expect(transformToOrganisationRows([mockOrgData[0]])).toStrictEqual([
      {
        address: [FALLBACK_DASH],
        amount_paid: '-',
        organisations: [
          {
            avatar_src: 'kitman_logo_full_bleed.png',
            href: '/registration/organisations?id=115',
            id: 115,
            text: 'KL Galaxy',
          },
        ],
        id: 115,
        total_athletes: 0,
        total_squads: 6,
        total_staff: 0,
        wallet: '-',
      },
    ]);
  });

  it('correctly parses an organisation to an organisation row object with all values', () => {
    expect(transformToOrganisationRows([mockOrgData[1]])).toStrictEqual([
      {
        address: [FALLBACK_DASH],
        amount_paid: 0,
        organisations: [
          {
            avatar_src: 'kitman_logo_full_bleed.png',
            href: '/registration/organisations?id=116',
            id: 116,
            text: 'KL Earthquakes',
          },
        ],
        id: 116,
        total_athletes: 0,
        total_squads: 6,
        total_staff: 0,
        wallet: 1500,
      },
    ]);
  });

  it('correctly parses all the organisation rows', () => {
    expect(transformToOrganisationRows(mockOrgData)).toHaveLength(3);
  });
});
