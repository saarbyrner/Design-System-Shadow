import { screen, render } from '@testing-library/react';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import {
  MOCK_CURRENT_USER,
  MOCK_PERMISSIONS,
  MOCK_NO_PERMISSIONS,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import {
  useGetOrganisationQuery,
  useGetActiveSquadQuery,
  useGetCurrentUserQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { data as MOCK_ORG } from '@kitman/services/src/mocks/handlers/getOrganisation';
import { data as MOCK_ACTIVE_SQUAD } from '@kitman/services/src/mocks/handlers/getActiveSquad';

import {
  getOrganisation,
  getActiveSquad,
} from '@kitman/common/src/redux/global/selectors';
import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
  getHomegrownPermissions,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { REDUCER_KEY as REGISTRATION_GRID_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import {
  registrationGlobalApi,
  useSearchOrganisationListQuery,
  useSearchAthleteListQuery,
  useSearchSquadListQuery,
  useSearchUserListQuery,
  useFetchRegistrationStatusOptionsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';

import { USER_TYPES } from '@kitman/modules/src/LeagueOperations/shared/consts';
import { getSelectedRow } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors';

import useLocationHash from '@kitman/common/src/hooks/useLocationHash';
import RegistrationAssociationApp from '..';

jest.mock('@kitman/common/src/hooks/useLocationHash');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
);
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getOrganisation: jest.fn(),
  getActiveSquad: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getRegistrationUserTypeFactory: jest.fn(),
    getRegistrationPermissions: jest.fn(),
    getHomegrownPermissions: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors'
    ),
    getSelectedRow: jest.fn(),
  })
);

jest.mock('@kitman/common/src/hooks/useEventTracking');

jest.mock('@kitman/common/src/contexts/PermissionsContext');

const createMockStore = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = createMockStore({
  globalApi: {},
  [REGISTRATION_GRID_REDUCER_KEY]: {
    grids: null,
    modal: {
      isOpen: false,
      action: '',
      text: {},
    },
    panel: {
      isOpen: false,
    },
    approvalState: {
      status: undefined,
      reasonId: undefined,
      annotation: '',
    },
    selectedRow: { id: null },
  },
});

const mockRTKQueries = (
  state = {
    isLoading: true,
    isError: false,
    isSuccess: false,
    data: { data: [], meta: {} },
  }
) => {
  useSearchOrganisationListQuery.mockReturnValue(state);
  useSearchAthleteListQuery.mockReturnValue(state);
  useSearchSquadListQuery.mockReturnValue(state);
  useSearchUserListQuery.mockReturnValue(state);
  useFetchRegistrationStatusOptionsQuery.mockReturnValue(state);
  registrationGlobalApi.useCreateUserRegistrationStatusMutation.mockReturnValue(
    [jest.fn().mockResolvedValue({ data: {} })]
  );
  registrationGlobalApi.useUpdateUserRegistrationStatusMutation.mockReturnValue(
    [jest.fn().mockResolvedValue({ data: {} })]
  );
};

setI18n(i18n);
const i18nT = i18nextTranslateStub();

const props = { t: i18nT };

const renderWithProviders = (store) => {
  render(
    <Provider store={store}>
      <RegistrationAssociationApp {...props} />
    </Provider>
  );
};

const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type,
  mockedPermissions = MOCK_NO_PERMISSIONS.registration,
  mockedHomegrownPermissions = MOCK_NO_PERMISSIONS.homegrown
) => {
  usePermissions.mockReturnValue({
    ...mockedPermissions,
    homegrown: mockedHomegrownPermissions,
  });
  getRegistrationPermissions.mockReturnValue(() => mockedPermissions);
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
  getHomegrownPermissions.mockReturnValue(() => mockedHomegrownPermissions);
  getOrganisation.mockReturnValue(() => MOCK_ORG);
  getActiveSquad.mockReturnValue(() => MOCK_ACTIVE_SQUAD);
  getSelectedRow.mockReturnValue(() => ({ id: null }));
};

const mockLoadedGlobalQuery = () => {
  useGetOrganisationQuery.mockReturnValue({
    data: MOCK_ORG,
    isLoading: false,
  });
  useGetActiveSquadQuery.mockReturnValue({
    data: MOCK_ACTIVE_SQUAD,
    isLoading: false,
  });
  useGetCurrentUserQuery.mockReturnValue({
    data: MOCK_CURRENT_USER,
    isLoading: false,
  });

  useRegistrationStatus.mockReturnValue({
    registrationFilterStatuses: [
      { id: 1, value: 'pending_league', label: 'Pending League' },
    ],
    isSuccessRegistrationFilterStatuses: true,
  });
};

describe('RegistrationAssociationApp', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({
      trackEvent: jest.fn(),
    });
    mockLoadedGlobalQuery();
  });

  describe('Association Admin View', () => {
    beforeEach(() => {
      mockSelectors(USER_TYPES.ASSOCIATION_ADMIN, {
        ...MOCK_NO_PERMISSIONS.registration,
        organisation: { canView: true },
      });
      mockRTKQueries({ isLoading: true });
    });

    it('displays registration heading', () => {
      renderWithProviders(defaultStore);
      expect(
        screen.getByRole('heading', { name: 'Registration' })
      ).toBeInTheDocument();
    });
  });

  describe('Permission-based Tab Rendering', () => {
    describe('when user has organisation view permission', () => {
      beforeEach(() => {
        mockSelectors(USER_TYPES.ASSOCIATION_ADMIN, {
          ...MOCK_NO_PERMISSIONS.registration,
          organisation: { canView: true },
        });
        mockRTKQueries({ isLoading: true });
        renderWithProviders(defaultStore);
      });

      it('displays Clubs tab', () => {
        expect(screen.getByRole('tab', { name: 'Clubs' })).toBeInTheDocument();
      });
    });

    describe('when user has athlete view permission', () => {
      beforeEach(() => {
        mockSelectors(USER_TYPES.ASSOCIATION_ADMIN, {
          ...MOCK_NO_PERMISSIONS.registration,
          athlete: { canView: true },
        });
        mockRTKQueries({ isLoading: true }); // Add missing mockRTKQueries call
        renderWithProviders(defaultStore);
      });

      it('displays Players tab', () => {
        expect(
          screen.getByRole('tab', { name: 'Players' })
        ).toBeInTheDocument();
      });
    });

    describe('when user has staff view permission', () => {
      beforeEach(() => {
        mockSelectors(USER_TYPES.ASSOCIATION_ADMIN, {
          ...MOCK_NO_PERMISSIONS.registration,
          staff: { canView: true },
        });

        mockRTKQueries({ isLoading: true });
        renderWithProviders(defaultStore);
      });

      it('displays Staff tab', () => {
        expect(screen.getByRole('tab', { name: 'Staff' })).toBeInTheDocument();
      });
    });

    describe('when user has all permissions', () => {
      beforeEach(() => {
        mockSelectors(
          USER_TYPES.ASSOCIATION_ADMIN,
          MOCK_PERMISSIONS.registration
        );
        mockRTKQueries({ isLoading: true });
        renderWithProviders(defaultStore);
      });

      it('displays all tabs', () => {
        expect(screen.getByRole('tab', { name: 'Clubs' })).toBeInTheDocument();
        expect(
          screen.getByRole('tab', { name: 'Players' })
        ).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Staff' })).toBeInTheDocument();
      });

      describe('show export button', () => {
        it('does not render without permission', () => {
          useLocationHash.mockReturnValue('#players');
          mockSelectors(
            USER_TYPES.ASSOCIATION_ADMIN,
            MOCK_NO_PERMISSIONS.registration
          );
          renderWithProviders(defaultStore);

          expect(
            screen.queryByRole('button', { name: 'Export' })
          ).not.toBeInTheDocument();
        });

        it('renders correctly with payment permission', () => {
          useLocationHash.mockReturnValue('#players');
          mockSelectors(
            USER_TYPES.ASSOCIATION_ADMIN,
            MOCK_PERMISSIONS.registration,
            MOCK_NO_PERMISSIONS.homegrown
          );

          renderWithProviders(defaultStore);
          expect(
            screen.queryAllByRole('button', { name: 'Export' }).at(0)
          ).toBeInTheDocument();
        });

        it('renders correctly with homegrown permission', () => {
          useLocationHash.mockReturnValue('#players');
          mockSelectors(
            USER_TYPES.ASSOCIATION_ADMIN,
            MOCK_NO_PERMISSIONS.registration,
            MOCK_PERMISSIONS.homegrown
          );
          renderWithProviders(defaultStore);

          expect(
            screen.queryAllByRole('button', { name: 'Export' }).at(0)
          ).toBeInTheDocument();
        });
      });
    });
  });
});
