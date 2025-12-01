import { data as mockUserData } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_user_list';

import transformToStaffRows from '../utils';

describe('transformToStaffRows', () => {
  const mockRegistrations = {
    registrations: [
      {
        division: {
          id: 1,
          name: 'KLS Next',
        },
        id: 13618,
        status: 'pending_payment',
        user_id: 161192,
      },
      {
        division: {
          id: 2,
          name: 'MLS Next',
        },
        id: 17788,
        status: 'incomplete',
        user_id: 161192,
      },
    ],
  };

  const mappedMockUserData = mockUserData.map((user) => ({
    ...user,
    ...mockRegistrations,
  }));

  beforeEach(() => {
    window.featureFlags['league-ops-update-registration-status'] = false;
  });

  const result = {
    ...mockRegistrations,
    address: ['Tennessee'],
    organisations: [
      {
        avatar_src:
          'https://kitman-staging.imgix.net/kitman_logo_full_bleed.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=96&h=96',
        href: '/registration/organisations?id=115',
        id: 115,
        text: 'LA Galaxy',
      },
    ],
    date_of_birth: 'Jul 6, 2023',
    id: '645235245664daf0f8fccc44',
    id_number: '645235245664daf0f8fccc44',
    leagues: 'Multiple',
    registration_status: 'pending_organisation',
    registration_status_reason: null,
    registration_system_status: {
      id: 9,
      name: 'Pending League',
      type: 'pending_league',
    },
    user: [
      {
        avatar_src:
          'https://kitman-staging.imgix.net/kitman-staff.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=96&h=96',
        href: '/registration/profile?id=645235245664daf0f8fccc44',
        id: '645235245664daf0f8fccc44',
        text: 'Latasha Christian',
      },
    ],
    title: 'Head Coach',
  };
  it('correctly parses a User to row data', () => {
    expect(
      transformToStaffRows([{ ...mockUserData[0], ...mockRegistrations }])
    ).toStrictEqual([result]);
  });

  it('correctly parses a User to row data, when FF is enabled', () => {
    window.featureFlags['league-ops-update-registration-status'] = true;

    expect(
      transformToStaffRows([{ ...mockUserData[0], ...mockRegistrations }])
    ).toStrictEqual([
      {
        ...result,
        registration_status: 'pending_organisation',
        registration_system_status: {
          id: 9,
          name: 'Pending League',
          type: 'pending_league',
        },
      },
    ]);
  });

  it('correctly parses all the User s', () => {
    expect(transformToStaffRows(mappedMockUserData)).toHaveLength(3);
  });
});
