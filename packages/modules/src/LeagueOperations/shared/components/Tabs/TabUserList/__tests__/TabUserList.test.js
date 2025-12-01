import { setI18n } from 'react-i18next';
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';

import i18n from '@kitman/common/src/utils/i18n';
import { GridActionsCellItem } from '@kitman/playbook/components';
import {
  useSearchUserListQuery,
  useFetchRegistrationStatusOptionsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import useGridActions from '@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions';

import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';

import {
  MOCK_STAFF_LIST,
  MOCK_CURRENT_USER,
  DEFAULT_STORE,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import TabUserList from '..';

jest.mock('@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getRegistrationUserTypeFactory: jest.fn(),
    getRegistrationPermissions: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
    ),
    useSearchUserListQuery: jest.fn(),
    useFetchRegistrationStatusOptionsQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi'
    ),
    useFetchRegistrationGridsQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus'
);

setI18n(i18n);

const renderWithProviders = (storeArg, children) => {
  render(<Provider store={storeArg}>{children}</Provider>);
};

const mockStaffWithRegistrations = {
  ...MOCK_STAFF_LIST,
  data: MOCK_STAFF_LIST.data.map((staff) => ({
    ...staff,
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
  })),
};

const mockRTKQueries = ({ grid, squads }) => {
  useFetchRegistrationGridsQuery.mockReturnValue({
    data: grid,
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useSearchUserListQuery.mockReturnValue(squads);

  useFetchRegistrationStatusOptionsQuery.mockReturnValue({
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useRegistrationStatus.mockReturnValue({
    registrationFilterStatuses: [],
    isSuccessRegistrationFilterStatuses: false,
  });
};
const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type
) => {
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
};

describe('<TabUserList/>', () => {
  beforeEach(() => {
    useGridActions.mockReturnValue({
      actions: () => [
        <GridActionsCellItem
          label="label"
          onClick={() => {}}
          showInMenu
          key="key"
        />,
      ],
    });
    window.featureFlags['league-ops-update-registration-status'] = false;
    window.featureFlags['league-ops-expire-registration-profiles'] = true;
  });
  describe('loading state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.association_admin.staff,
        squads: {
          data: {},
          isLoading: true,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the loading state', () => {
      renderWithProviders(DEFAULT_STORE, <TabUserList />);
      expect(screen.getByTestId('ListLayout.LoadingTitle')).toBeInTheDocument();
      expect(
        screen.getByTestId('ListLayout.LoadingFilters')
      ).toBeInTheDocument();
    });
  });
  describe('success state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.association_admin.staff,
        squads: {
          data: mockStaffWithRegistrations,
          isLoading: false,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the success state', async () => {
      renderWithProviders(DEFAULT_STORE, <TabUserList />);
      expect(
        screen.getByRole('heading', { name: 'Staff' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: 'Status' })
      ).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(4);
      expect(
        screen.getByRole('row', {
          name: 'Coach Team League(s) ID Number State / Province DOB Title Status',
        })
      ).toBeInTheDocument();
    });
  });

  describe('grid columns', () => {
    describe('success state', () => {
      beforeEach(() => {
        mockRTKQueries({
          grid: MLS_NEXT_GRIDS.association_admin.staff,
          squads: {
            data: mockStaffWithRegistrations,
            isLoading: false,
            isFetching: false,
            isError: false,
          },
        });
        mockSelectors();
      });
      it('renders the column action', async () => {
        renderWithProviders(DEFAULT_STORE, <TabUserList />);
        expect(screen.getAllByRole('columnheader')).toHaveLength(9);
      });
    });
  });
});
