import { Provider } from 'react-redux';
import { screen, waitFor, render } from '@testing-library/react';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useKitMatrixDataGrid } from '@kitman/modules/src/KitMatrix/shared/hooks';
import mockLeagueSeasons from '@kitman/services/src/services/kitMatrix/getLeagueSeasons/mock';
import {
  useUpdateKitMatrixMutation,
  useCreateKitMatrixMutation,
  useGetLeagueSeasonsQuery,
} from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import mockKitMatrices from '@kitman/services/src/services/kitMatrix/searchKitMatrices/mock';
import KitMatrixApp from '..';

jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/modules/src/KitMatrix/shared/hooks');
jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi');
jest.mock('@kitman/services/src/services/kitMatrix/getLeagueSeasons');

const mockDispatch = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => state,
});

const defaultStore = storeFake({
  global: {
    useGlobal: jest.fn(),
    useLeagueOperations: jest.fn(),
    useKitMatrixDataGrid: jest.fn(),
    useUpdateKitMatrixMutation: jest.fn(),
  },
});

const props = {
  t: i18nextTranslateStub(),
};

const renderWithProviders = (storeArg, localProps) => {
  render(
    <Provider store={storeArg}>
      <KitMatrixApp {...props} {...localProps} />
    </Provider>
  );
};

describe('<KitMatrixApp />', () => {
  describe('[INITIAL STATE] - loading', () => {
    beforeEach(() => {
      useGlobal.mockReturnValue({
        isLoading: true,
        hasFailed: false,
        isSuccess: false,
      });
      useLeagueOperations.mockReturnValue({
        isLeague: false,
      });
      useKitMatrixDataGrid.mockReturnValue({
        setNextId: 1,
        searchKitMatricesQuery: {
          data: { kit_matrices: mockKitMatrices.kit_matrices },
          isFetching: false,
        },
      });
      usePermissions.mockReturnValue({
        permissions: {
          leagueGame: {
            manageKits: false,
          },
        },
      });
      useUpdateKitMatrixMutation.mockReturnValue([
        jest.fn(),
        { isLoading: false },
      ]);
      useCreateKitMatrixMutation.mockReturnValue([
        jest.fn(),
        { isLoading: false },
      ]);
      useGetLeagueSeasonsQuery.mockReturnValue({
        data: mockLeagueSeasons,
        isFetching: false,
      });
    });

    it('renders the spinner when `isLoading` is `true`', async () => {
      renderWithProviders(defaultStore);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('[FAILURE STATE]', () => {
    beforeEach(() => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: true,
        isSuccess: false,
      });
    });

    it('renders the error state when `hasFailed` is `true`', async () => {
      renderWithProviders(defaultStore);

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });
  });

  describe('[SUCCESS STATE]', () => {
    beforeEach(() => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: true,
      });
      useLeagueOperations.mockReturnValue({
        isLeague: false,
      });
      useKitMatrixDataGrid.mockReturnValue({
        setNextId: 1,
        searchKitMatricesQuery: {
          data: { kit_matrices: mockKitMatrices.kit_matrices },
          isFetching: false,
        },
        renderFilter: jest.fn(),
        renderDataGrid: jest.fn(),
      });
      usePermissions.mockReturnValue({
        permissions: {
          leagueGame: {
            manageKits: true,
          },
        },
      });
      useUpdateKitMatrixMutation.mockReturnValue([
        jest.fn(),
        { isLoading: false },
      ]);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('renders the success state when `isSuccess` is `true`', async () => {
      renderWithProviders(defaultStore);

      await waitFor(() => {
        expect(screen.getByText('Kit Sets')).toBeInTheDocument();
      });
    });
  });
});
