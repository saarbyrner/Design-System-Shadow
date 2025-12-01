import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { screen, render } from '@testing-library/react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Provider } from 'react-redux';

import {
  useSearchAthleteListQuery,
  useFetchRegistrationStatusOptionsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';
import useGridActions from '@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import {
  MOCK_ATHLETE_LIST,
  MOCK_CURRENT_USER,
  DEFAULT_STORE,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import TabAthleteList from '..';

jest.mock('@kitman/common/src/contexts/PermissionsContext');
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
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi'
    ),
    useFetchRegistrationGridsQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
    ),
    useSearchAthleteListQuery: jest.fn(),
    useFetchRegistrationStatusOptionsQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus'
);

setI18n(i18n);

const renderWithProviders = (storeArg, children) => {
  render(
    <Provider store={storeArg}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        {children}
      </LocalizationProvider>
    </Provider>
  );
};

const mockRTKQueries = ({ grid, athletes }) => {
  useFetchRegistrationGridsQuery.mockReturnValue({
    data: grid,
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useFetchRegistrationStatusOptionsQuery.mockReturnValue({
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useSearchAthleteListQuery.mockReturnValue(athletes);
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

const commonAssertions = () => {
  expect(screen.getByRole('heading', { name: 'Players' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: 'Status' })).toBeInTheDocument();
  expect(screen.getAllByRole('row')).toHaveLength(7);
};

describe('<TabAthleteList/>', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: { homegrown: { canViewHomegrown: false } },
    });
    useGridActions.mockReturnValue({
      actions: () => ({
        filter: () => [],
      }),
    });
    window.featureFlags['league-ops-update-registration-status'] = false;
    window.featureFlags['league-ops-expire-registration-profiles'] = true;
    window.featureFlags['lops-grid-filter-enhancements'] = false;
  });

  describe('loading state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.association_admin.athlete,
        athletes: {
          data: {},
          isLoading: true,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the loading state', () => {
      renderWithProviders(DEFAULT_STORE, <TabAthleteList />);
      expect(screen.getByTestId('ListLayout.LoadingTitle')).toBeInTheDocument();
      expect(
        screen.getByTestId('ListLayout.LoadingFilters')
      ).toBeInTheDocument();
    });
  });
  describe('user type - association_admin', () => {
    describe('success state', () => {
      beforeEach(() => {
        mockRTKQueries({
          grid: MLS_NEXT_GRIDS.association_admin.athlete,

          athletes: {
            data: MOCK_ATHLETE_LIST,
            isLoading: false,
            isFetching: false,
            isError: false,
          },
        });

        mockSelectors();
      });
      it('renders the success state', async () => {
        renderWithProviders(DEFAULT_STORE, <TabAthleteList />);
        commonAssertions();
        expect(
          screen.getByRole('row', {
            name: /Player Club\(s\) ID Number League\(s\) DOB Position Status/,
          })
        ).toBeInTheDocument();
      });
    });
  });
  describe('user type - organisation_admin', () => {
    describe('success state', () => {
      beforeEach(() => {
        mockRTKQueries({
          grid: MLS_NEXT_GRIDS.organisation_admin.athlete,
          athletes: {
            data: MOCK_ATHLETE_LIST,
            isLoading: false,
            isFetching: false,
            isError: false,
          },
        });
        mockSelectors();
      });
      it('renders the success state', async () => {
        renderWithProviders(DEFAULT_STORE, <TabAthleteList />);
        commonAssertions();
        expect(
          screen.getByRole('row', {
            name: /Player ID Number Team State \/ Province DOB Jersey No Type Status/i,
          })
        ).toBeInTheDocument();
      });
    });
  });

  describe('grid columns', () => {
    describe('success state', () => {
      beforeEach(() => {
        mockRTKQueries({
          grid: MLS_NEXT_GRIDS.organisation_admin.athlete,
          athletes: {
            data: MOCK_ATHLETE_LIST,
            isLoading: false,
            isFetching: false,
            isError: false,
          },
        });
        mockSelectors();
      });
      it('renders the column action', async () => {
        renderWithProviders(DEFAULT_STORE, <TabAthleteList />);
        commonAssertions();
        expect(screen.getAllByRole('columnheader')).toHaveLength(9);
      });
    });
  });

  describe('labels', () => {
    describe('filter', () => {
      beforeEach(() => {
        usePermissions.mockReturnValue({
          permissions: {
            homegrown: { canViewHomegrown: true },
            settings: { canAssignLabels: true },
          },
        });

        mockRTKQueries({
          grid: MLS_NEXT_GRIDS.organisation_admin.athlete,
          athletes: {
            data: MOCK_ATHLETE_LIST,
            isLoading: false,
            isFetching: false,
            isError: false,
          },
        });
        mockSelectors();
      });

      it('renders the DOB range and labels filters', async () => {
        renderWithProviders(DEFAULT_STORE, <TabAthleteList />);
        commonAssertions();
        expect(screen.getByText('DOB range')).toBeInTheDocument();
        expect(screen.getByTestId('label-select')).toBeInTheDocument();
      });

      it('does not renders the DOB range and labels filters', async () => {
        usePermissions.mockReturnValue({
          permissions: {
            homegrown: { canViewHomegrown: false },
            settings: { canAssignLabels: false },
          },
        });

        renderWithProviders(DEFAULT_STORE, <TabAthleteList />);
        commonAssertions();
        expect(screen.queryByText('DOB range')).not.toBeInTheDocument();

        expect(screen.queryByTestId('label-select')).not.toBeInTheDocument();
      });
    });
  });
});
