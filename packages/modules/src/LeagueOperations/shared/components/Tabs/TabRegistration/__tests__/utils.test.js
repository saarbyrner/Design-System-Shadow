import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_details_data';
import transformRegistrationRows from '../utils';

jest.mock('uuid', () => ({ v4: () => 123456789 }));

describe('transformToStaffRows', () => {
  beforeEach(() => {
    window.featureFlags['league-ops-update-registration-status'] = false;
  });
  const profile = {
    id: 123,
    squads: [
      {
        id: 3494,
        name: 'U13',
      },
    ],
    organisations: [
      {
        avatar_src: 'kitman_logo_full_bleed.png',
        id: 116,
        text: 'KL Galaxy',
      },
    ],
  };
  it('transforms raw registration data into formatted rows', () => {
    const transformedData = transformRegistrationRows([response.data[0]], {
      ...profile,
      type: 'FR',
    });
    expect(transformedData).toEqual([
      {
        club: [
          {
            avatar_src: '',
            id: 116,
            text: undefined,
          },
        ],
        id: 1,
        jersey_no: ['4', '6'],
        league: {
          href: '/registration/requirements?requirement_id=14&user_id=161616',
          text: 'MLS',
        },
        position: 'RW',
        registration_status: 'incomplete',
        registration_system_status: {
          id: 9,
          name: 'Pending League',
          type: 'pending_league',
        },
        squad: [' U18', ' U21'],
        title: '-',
        type: 'FR',
      },
    ]);
  });

  it('sets an id for raw registration data with no id', () => {
    const transformedData = transformRegistrationRows(
      [response.data[1]],
      profile
    );
    expect(transformedData).toEqual([
      {
        club: [
          {
            avatar_src: '',
            id: 116,
            text: undefined,
          },
        ],
        id: 123456789,
        jersey_no: ['9'],
        league: {
          href: '/registration/requirements?requirement_id=15&user_id=161488',
          text: 'MLS NEXT Pro',
        },
        position: 'CF',
        registration_status: 'incomplete',
        registration_system_status: null,
        squad: [' U15'],
        title: '-',
        type: '-',
      },
    ]);
  });

  it('transforms raw registration data, when feature flag is enabled', () => {
    window.featureFlags['league-ops-update-registration-status'] = true;

    const transformedData = transformRegistrationRows([response.data[0]], {
      ...profile,
      type: 'FR',
    });
    expect(transformedData).toEqual([
      {
        club: [
          {
            avatar_src: '',
            id: 116,
            text: undefined,
          },
        ],
        id: 1,
        jersey_no: ['4', '6'],
        league: {
          href: '/registration/requirements?requirement_id=14&user_id=161616',
          text: 'MLS',
        },
        position: 'RW',
        registration_status: 'incomplete',
        registration_system_status: {
          id: 9,
          name: 'Pending League',
          type: 'pending_league',
        },
        squad: [' U18', ' U21'],
        title: '-',
        type: 'FR',
      },
    ]);
  });
});
