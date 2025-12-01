import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  screen,
  render,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Provider } from 'react-redux';

import {
  useSearchAthleteListQuery,
  useFetchRegistrationStatusOptionsQuery,
  useGetAllLabelsQuery,
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
    useGetAllLabelsQuery: jest.fn(),
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
    registrationFilterStatuses: [
      { id: 1, value: 'pending_league', label: 'Pending League' },
    ],
    isSuccessRegistrationFilterStatuses: true,
  });
  useGetAllLabelsQuery.mockReturnValue({
    data: [
      { id: 1, name: 'Label 1' },
      { id: 2, name: 'Label 2' },
    ],
    isLoading: false,
    isFetching: false,
    isError: false,
  });
};
const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type
) => {
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
};

const commonAssertions = () => {
  expect(screen.getByRole('heading', { name: 'Players' })).toBeInTheDocument();
  expect(screen.getByLabelText('Search')).toBeInTheDocument();
  expect(
    screen.getByLabelText('Status', { selector: 'input' })
  ).toBeInTheDocument();
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
    window.setFlag('league-ops-homegrown-registrations', true);
    window.setFlag('lops-grid-filter-enhancements', true);
    window.setFlag('league-ops-update-registration-status', false);
    window.setFlag('league-ops-expire-registration-profiles', true);
  });

  afterEach(() => {
    window.setFlag('league-ops-homegrown-registrations', false);
    window.setFlag('lops-grid-filter-enhancements', false);
    window.setFlag('league-ops-update-registration-status', false);
    window.setFlag('league-ops-expire-registration-profiles', false);
    jest.clearAllMocks();
    jest.resetAllMocks();
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
        window.featureFlags['league-ops-homegrown-registrations'] = true;
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
        expect(screen.getByLabelText('DOB range')).toBeInTheDocument();
        expect(
          screen.getByLabelText('Labels', { selector: 'input' })
        ).toBeInTheDocument();
      });

      it('does not renders the DOB range and labels filters', async () => {
        window.featureFlags['league-ops-homegrown-registrations'] = false;

        renderWithProviders(DEFAULT_STORE, <TabAthleteList />);
        commonAssertions();
        expect(screen.queryByLabelText('DOB range')).not.toBeInTheDocument();
        expect(
          screen.queryByLabelText('Labels', { selector: 'input' })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('filters', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      usePermissions.mockReturnValue({
        permissions: {
          homegrown: { canViewHomegrown: true },
          settings: { canAssignLabels: true },
        },
      });
      window.featureFlags['league-ops-homegrown-registrations'] = true;
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

    afterEach(() => {
      jest.useRealTimers();
    });
    it('calls the useSearchAthleteListQuery with the correct filters', async () => {
      renderWithProviders(DEFAULT_STORE, <TabAthleteList />);
      commonAssertions();

      const dobRange = screen.getByLabelText('DOB range');

      const searchInput = screen.getByLabelText('Search', {
        selector: 'input',
      });

      fireEvent.change(searchInput, { target: { value: 'test' } });

      fireEvent.change(dobRange, {
        target: { value: '01/01/2020 - 01/01/2025' },
      });

      const labelSelect = screen.getByLabelText('Labels', {
        selector: 'input',
      });

      fireEvent.change(labelSelect, { target: { value: 'Label 1' } });

      fireEvent.click(screen.getByRole('option', { name: 'Label 1' }));

      const statusSelect = screen.getByLabelText('Status', {
        selector: 'input',
      });

      fireEvent.change(statusSelect, { target: { value: 'Pending League' } });

      fireEvent.click(screen.getByRole('option', { name: 'Pending League' }));

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(useSearchAthleteListQuery).toHaveBeenLastCalledWith(
          expect.objectContaining({
            registration_status: 'pending_league',
            date_range: { start_date: '2020-01-01', end_date: '2025-01-01' },
            label_ids: [1],
            registration_system_status_id: 1,
            organisation_ids: null,
            page: 1,
            per_page: 30,
            squad_ids: null,
          })
        );
      });

      const clearButton = screen.getByRole('button', { name: 'Clear' });
      fireEvent.click(clearButton);

      act(() => {
        jest.runAllTimers();
      });

      expect(useSearchAthleteListQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({
          registration_status: '',
          date_range: null,
          label_ids: null,
          registration_system_status_id: null,
          page: 1,
          per_page: 30,
          organisation_ids: null,
          squad_ids: null,
        })
      );
    });
  });
});
