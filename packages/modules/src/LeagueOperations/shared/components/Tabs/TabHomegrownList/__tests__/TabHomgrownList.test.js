import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Provider } from 'react-redux';

import {
  useFetchRegistrationStatusOptionsQuery,
  useSearchHomegrownListQuery,
  useArchiveHomegrownSubmissionMutation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';
import useGridActions from '@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import {
  MOCK_CURRENT_USER,
  DEFAULT_STORE,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { response as mockHomegrownListResponse } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_homegrown_list';

import TabHomegrownList from '..';

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
    useSearchHomegrownListQuery: jest.fn(),
    useArchiveHomegrownSubmissionMutation: jest.fn(),
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

const mockRTKQueries = ({ grid }) => {
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
  useSearchHomegrownListQuery.mockReturnValue({
    data: mockHomegrownListResponse,
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

describe('<TabHomegrownList />', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        homegrown: { canViewHomegrown: true, canManageHomegrown: true },
      },
    });
    useGridActions.mockReturnValue({
      actions: () => ({
        filter: () => [],
      }),
    });
    window.featureFlags['league-ops-update-registration-status'] = false;
    window.featureFlags['league-ops-expire-registration-profiles'] = true;
  });
  const archiveMock = jest.fn();
  useArchiveHomegrownSubmissionMutation.mockReturnValue([archiveMock]);
  describe('success state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.association_admin.homegrown,
      });
      mockSelectors();
    });

    it('renders the grid', async () => {
      renderWithProviders(DEFAULT_STORE, <TabHomegrownList />);
      // Title
      expect(
        screen.getByRole('heading', { name: 'Homegrown' })
      ).toBeInTheDocument();
      // Filters
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      // Headers
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Date submitted')).toBeInTheDocument();
      expect(screen.getByText('Submitted by')).toBeInTheDocument();
      expect(screen.getByText('Certified by')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    describe('canManageHomegrown is TRUE', () => {
      it('renders the actions button', async () => {
        const user = userEvent.setup();
        renderWithProviders(
          DEFAULT_STORE,
          <TabHomegrownList permissions={{ canManageHomegrown: true }} />
        );
        const actionsBtn = screen.getByTestId('MoreVertIcon');
        expect(actionsBtn).toBeInTheDocument();
        await user.click(actionsBtn);
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
      });

      describe('Delete action is clicked', () => {
        it('calls the archive submission call', async () => {
          const user = userEvent.setup();

          renderWithProviders(
            DEFAULT_STORE,
            <TabHomegrownList permissions={{ canManageHomegrown: true }} />
          );

          const actionsBtn = screen.getByTestId('MoreVertIcon');
          expect(actionsBtn).toBeInTheDocument();
          await user.click(actionsBtn);
          const deleteBtn = screen.getByText('Delete');
          await user.click(deleteBtn);
          expect(
            screen.getByText('Are you sure you want to delete this submission?')
          ).toBeInTheDocument();
          const confirmDeleteButon = screen.getByText('Confirm');
          await user.click(confirmDeleteButon);
          expect(archiveMock).toHaveBeenCalledWith(
            mockHomegrownListResponse.data[0].id
          );
        });
      });
    });

    describe('canManageHomegrown is FALSE', () => {
      it('does not render the actions button', async () => {
        renderWithProviders(
          DEFAULT_STORE,
          <TabHomegrownList permissions={{ canManageHomegrown: false }} />
        );
        expect(screen.queryByTestId('MoreVertIcon')).not.toBeInTheDocument();
      });
    });
  });
});
