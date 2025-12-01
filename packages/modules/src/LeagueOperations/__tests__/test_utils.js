// @flow
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetActiveSquadQuery,
  useGetPreferencesQuery,
  useGetCurrentUserQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import grids from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_grids';
import {
  data as organisationData,
  response as mockOrganisationResponse,
} from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_organisations_list';
import {
  data as squadData,
  response as mockSquads,
} from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_squad_list';
import { response as mockStaff } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_user_list';
import { response as mockAthletes } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_athlete_list';
import { response as mockSections } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registrations_sections';
import { response as mockAthleteDiscipline } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_search_discipline';
import { REDUCER_KEY as LOPS_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/api/leagueOperations';
import { REDUCER_KEY as REGISTRATIONS_GRID_SLICE } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import {
  ASSOCIATION_ADMIN,
  ORGANISATION_ADMIN,
  ATHLETE,
  STAFF,
} from '../shared/consts';

import { data } from '../shared/services/mocks/data/mock_registration_profile';

export const MOCK_CURRENT_USER = {
  id: 11111,
  firstname: 'Hacksaw Jim',
  lastname: 'Duggan',
  fullname: 'Hacksaw Jim Duggan',
  email: 'hacksawjimduggan@kitmanlabs.com',
  registration: {
    id: 161454,
    user_type: 'association_admin',
    required: false,
    status: null,
  },
  type: null,
  registrations: [
    {
      id: 1,
      user_id: 11111,
      status: 'incomplete',
      division: {
        id: 1,
        name: 'KLS Next',
      },
      registration_requirement: {
        id: 1,
        active: true,
      },
    },
    {
      id: null,
      user_id: 11111,
      status: 'incomplete',
      division: {
        id: 1,
        name: 'KLS Next',
      },
      registration_requirement: {
        id: 20,
        active: true,
      },
    },
  ],
  organisations: [
    {
      id: 1267,
      name: 'KL Galaxy',
      logo_full_path: 'some_url_here',
    },
  ],
};

export const MOCK_PERMISSIONS = {
  registration: {
    registrationArea: {
      canView: true,
    },
    organisation: {
      canView: true,
    },
    athlete: {
      canView: true,
      canEdit: false,
    },
    staff: {
      canView: true,
      canEdit: false,
    },
    requirements: {
      canView: true,
    },
    status: {
      canEdit: true,
    },
    payment: {
      canView: true,
      canEdit: false,
      canCreate: false,
      canExportPayment: true,
    },
  },
  discipline: {
    canViewDisciplineArea: true,
    canViewDisciplineStaff: true,
    canViewDisciplineAthlete: true,
    canManageDiscipline: true,
  },
  homegrown: {
    canManageHomegrown: true,
    canViewHomegrown: true,
    canExportHomegrown: true,
  },
};

export const MOCK_NO_PERMISSIONS = {
  registration: {
    registrationArea: {
      canView: false,
    },
    organisation: {
      canView: false,
    },
    athlete: {
      canView: false,
      canEdit: false,
    },
    staff: {
      canView: false,
      canEdit: false,
    },
    requirements: {
      canView: false,
    },
    status: {
      canEdit: false,
    },
    payment: {
      canView: false,
      canEdit: false,
      canCreate: false,
      canExportPayment: false,
    },
  },
  discipline: {
    canViewDisciplineArea: false,
    canViewDisciplineStaff: false,
    canViewDisciplineAthlete: false,
    canManageDiscipline: false,
  },
  homegrown: {
    canManageHomegrown: false,
    canViewHomegrown: false,
    canExportHomegrown: false,
  },
};

export const USER_TYPE_ASSERTIONS = [
  ASSOCIATION_ADMIN,
  ORGANISATION_ADMIN,
  ATHLETE,
  STAFF,
];

export const MOCK_REGISTRATION_PROFILE = data;
export const MOCK_REGISTRATION_ORGANISATION = organisationData[0];
export const MOCK_REGISTRATION_SQUAD = squadData[0];
export const MOCK_ORGANISATION_LIST = mockOrganisationResponse;
export const MOCK_REGISTRATION_GRIDS = grids.association_organisation;
export const MOCK_REGISTRATION_GRID_QUERY = grids;
export const MOCK_ATHLETE_DISCIPLINE_GRID_QUERY = mockAthleteDiscipline;

export const DATE_ICE_AGE_ENDED = new Date('2024-07-19T00:00:01Z');

export const ABOUT_THREE_FIDDY = '$350.00';

export const MOCK_STAFF_LIST = mockStaff;
export const MOCK_ATHLETE_LIST = mockAthletes;
export const MOCK_SQUAD_LIST = mockSquads;
export const MOCK_SECTION_LIST = mockSections;

export const MOCK_GLOBAL_API = () => {
  useGetOrganisationQuery.mockReturnValue({
    data: {
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: {},
    },
  });
  useGetPermissionsQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: true,
  });
  useGetActiveSquadQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: true,
  });
  useGetPreferencesQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: true,
  });
  useGetCurrentUserQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: true,
  });
};

export const submitAssertions = {
  sansAnotation: [
    { status: RegistrationStatusEnum.PENDING_ORGANISATION, expected: false },
    { status: RegistrationStatusEnum.PENDING_ASSOCIATION, expected: false },
    { status: RegistrationStatusEnum.REJECTED_ORGANISATION, expected: true },
    { status: RegistrationStatusEnum.REJECTED_ASSOCIATION, expected: true },
    { status: RegistrationStatusEnum.PENDING_PAYMENT, expected: false },
    { status: RegistrationStatusEnum.APPROVED, expected: false },
  ],
  withAnnotation: [
    {
      status: RegistrationStatusEnum.PENDING_ORGANISATION,
      expected: false,
      annotation: '',
    },
    {
      status: RegistrationStatusEnum.PENDING_ASSOCIATION,
      expected: false,
      annotation: '',
    },
    {
      status: RegistrationStatusEnum.REJECTED_ORGANISATION,
      expected: false,
      annotation: 'I am a note',
    },
    {
      status: RegistrationStatusEnum.REJECTED_ASSOCIATION,
      expected: false,
      annotation: 'I am a note',
    },
    {
      status: RegistrationStatusEnum.PENDING_PAYMENT,
      expected: false,
      annotation: '',
    },
    {
      status: RegistrationStatusEnum.APPROVED,
      expected: false,
      annotation: '',
    },
  ],
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

export const DEFAULT_STORE = storeFake({
  globalApi: {},
  [LOPS_REDUCER_KEY]: {},
  [REGISTRATIONS_GRID_SLICE]: {
    bulkActions: {
      selectedAthleteIds: [],
      originalSelectedLabelIds: [],
      selectedLabelIds: [],
    },
  },
});

export const MOCK_DISCIPLINE_LIST = [
  {
    id: 1,
    kind: 'date_range',
    start_date: '2025-08-13T00:00:00-05:00',
    end_date: '2025-08-27T23:59:59-05:00',
    reasons: [
      {
        id: 1,
        reason_name: 'Card accumulation',
      },
    ],
    additional_notes: [],
    competitions: [],
    game_events: [],
    number_of_games: null,
    squad: null,
  },
];

export const DISCIPLINE_SUSPENSION_RESPONSE = {
  data: MOCK_DISCIPLINE_LIST,
};
