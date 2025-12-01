import { screen } from '@testing-library/react';
import { useSearchKitMatricesQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import mockKitMatrices from '@kitman/services/src/services/kitMatrix/searchKitMatrices/mock';
import { getStoreForTest } from '@kitman/modules/src/MatchDay/shared/utils';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import EquipmentsSelection from '..';

jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi');
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  usePermissions: jest.fn(),
  PermissionsProvider: ({ children }) => <div>{children}</div>,
}));

describe('EquipmentsSelection', () => {
  const renderComponent = ({ manageGameInformation = false }) => {
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          manageGameInformation,
        },
      },
    });

    return renderWithProviders(<EquipmentsSelection />, {
      store: getStoreForTest(),
    });
  };

  beforeEach(() => {
    useSearchKitMatricesQuery.mockReturnValue({
      data: { kit_matrices: mockKitMatrices.kit_matrices },
      isFetching: false,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', () => {
    useLeagueOperations.mockReturnValue({
      isLeague: true,
    });

    renderComponent({ manageGameInformation: true });

    expect(screen.getAllByText('KL Galaxy')).toHaveLength(2);
    expect(screen.getAllByText('KL Toronto')).toHaveLength(2);
    expect(screen.getByText('Officials')).toBeInTheDocument();
    expect(screen.getAllByText('No kit selected')).toHaveLength(5);
    expect(screen.getAllByTestId('EditOutlinedIcon')).toHaveLength(5);
  });

  it('hides edit icon when the manageGameInformation permission is false', () => {
    useLeagueOperations.mockReturnValue({
      isOrgSupervised: true,
    });

    renderComponent({});
    expect(screen.queryByTestId('EditOutlinedIcon')).not.toBeInTheDocument();
  });

  it('shows edit icon when organisation id match home or away team owner id', () => {
    useLeagueOperations.mockReturnValue({
      isOrgSupervised: true,
      organisationId: 1267,
    });

    renderComponent({ manageGameInformation: true });
    expect(screen.getAllByTestId('EditOutlinedIcon')).toHaveLength(2);
  });
});
