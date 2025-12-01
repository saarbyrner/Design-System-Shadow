import { data as mockAthleteData } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_athlete_list';
import { MOCK_ORGANISATION } from '@kitman/modules/src/LeagueOperations/shared/utils';
import {
  transformMultiRegistrationToRows,
  transformToAthleteRows,
} from '../utils';

jest.mock('uuid', () => ({ v4: () => 123456789 }));

describe('transformToAthleteRows', () => {
  const common = {
    athlete: [
      {
        avatar_src:
          'https://kitman-staging.imgix.net/kitman-staff.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=96&h=96',
        href: '/registration/profile?id=6',
        id: '645235245664daf0f8fccc44',
        text: 'Latasha Christian',
      },
    ],
    organisations: [
      {
        avatar_src:
          'https://kitman-staging.imgix.net/kitman_logo_full_bleed.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=96&h=96',
        href: '/registration/organisations?id=115',
        id: 115,
        text: 'LA Galaxy',
      },
    ],
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
    leagues: 'Multiple',
    registration_status: null,
    registration_status_reason: null,
    registration_system_status: {
      id: 9,
      name: 'Pending League',
      type: 'pending_league',
    },
    non_registered: false,
    id: '645235245664daf0f8fccc44',
    date_of_birth: 'Jan 11, 2004',
    user_id: 6,
    labels: [],
  };
  beforeEach(() => {
    window.featureFlags['league-ops-update-registration-status'] = false;
  });

  describe('when organisation_admin', () => {
    it('returns the correct row structure', () => {
      expect(
        transformToAthleteRows({
          rawRowData: [mockAthleteData[0]],
          currentUserType: 'organisation_admin',
        })
      ).toStrictEqual([
        {
          ...common,
          address: ['Tennessee'],
          id_number: '645235245664daf0f8fccc44',
          jersey_no: [29],
          squads: [
            { id: '64523524fdcd2b55ce021877', name: 'U14' },
            { id: '64523524fdcd2b55ce021833', name: 'U15' },
          ],
          teams: [' U14', ' U15'],
          position: 'Other',
          type: 'FR',
        },
      ]);
    });
  });
  describe('when association_admin', () => {
    it('returns the correct row structure', () => {
      expect(
        transformToAthleteRows({
          rawRowData: [mockAthleteData[0]],
          currentUserType: 'association_admin',
        })
      ).toStrictEqual([
        {
          ...common,
          team: {
            id: '64523524fdcd2b55ce021877',
            text: 'U14',
          },
          id_number: '645235245664daf0f8fccc44',
          position: 'Other',
          teams: {
            text: 'Multiple',
          },
        },
      ]);
    });
  });

  describe('when feature flag is enabled', () => {
    it('returns the correct row structure', () => {
      window.featureFlags['league-ops-update-registration-status'] = true;
      expect(
        transformToAthleteRows({
          rawRowData: [mockAthleteData[0]],
          currentUserType: 'association_admin',
        })
      ).toStrictEqual([
        {
          ...common,
          team: {
            id: '64523524fdcd2b55ce021877',
            text: 'U14',
          },
          registration_status: null,
          registration_system_status: {
            id: 9,
            name: 'Pending League',
            type: 'pending_league',
          },
          id_number: '645235245664daf0f8fccc44',
          position: 'Other',
          teams: {
            text: 'Multiple',
          },
        },
      ]);
    });
  });
});

describe('transformToRegistrationRows', () => {
  const mockMultiRegistration = [
    {
      id: 13618,
      user_id: 161192,
      status: 'pending_payment',
      division: {
        id: 1,
        name: 'KLS Next',
      },
    },
    {
      id: 17788,
      user_id: 161192,
      status: 'incomplete',
      division: {
        id: 2,
        name: 'MLS Next',
      },
    },
  ];
  it('correctly parses an MultiRegistrationRow  to row data', () => {
    expect(
      transformMultiRegistrationToRows(mockMultiRegistration)
    ).toStrictEqual([
      {
        dob: null,
        id: 13618,
        leagues: 'KLS Next',
        organisations: [MOCK_ORGANISATION],
        position: '-',
        registration_status: 'pending_payment',
      },
      {
        dob: null,
        id: 17788,
        leagues: 'MLS Next',
        organisations: [MOCK_ORGANISATION],
        position: '-',
        registration_status: 'incomplete',
      },
    ]);
  });
  it('correctly parses all the MultiRegistrationRow s', () => {
    expect(
      transformMultiRegistrationToRows(mockMultiRegistration)
    ).toHaveLength(2);
  });

  it('sets an id for raw data with no id', () => {
    const transformedData = transformMultiRegistrationToRows([
      {
        id: null,
        user_id: 1611,
        status: 'incomplete',
        division: {
          id: 1,
          name: 'KLS Next',
        },
      },
    ]);
    expect(transformedData).toStrictEqual([
      {
        dob: null,
        id: 123456789,
        leagues: 'KLS Next',
        organisations: [
          {
            avatar_src:
              'https://s3:9000/injpro-staging-public/kitman-stock-assets/test.png',
            id: 115,
            text: 'Kitman Labs',
          },
        ],
        position: '-',
        registration_status: 'incomplete',
      },
    ]);
  });
});
