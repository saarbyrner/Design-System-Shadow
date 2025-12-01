import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useGetMedicationListSourcesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { data } from '@kitman/services/src/mocks/handlers/medical/getMedicationListSources';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import StockListContainer from '../StockListContainer';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');
jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/common/src/redux/global/services/globalApi');

describe('<StockManagementFilters />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    global: {
      useGlobal: jest.fn(),
      useGetOrganisationQuery: jest.fn(),
      useGetPermissionsQuery: jest.fn(),
    },
    medicalSharedApi: {
      useGetMedicationListSourcesQuery: jest.fn(),
    },
  });

  useGetOrganisationQuery.mockReturnValue({
    data: {
      id: 66,
    },
    isError: false,
    isSuccess: true,
  });
  useGetPermissionsQuery.mockReturnValue({
    data: {
      medical: {
        stockManagement: {
          canAdd: true,
          canRemove: true,
        },
      },
    },
    isSuccess: true,
  });

  it('displays the AddStockSidePanel when getMedicationListSources has data', async () => {
    window.featureFlags['medications-general-availability'] = true;
    useGetMedicationListSourcesQuery.mockReturnValue({
      data,
      error: false,
      isLoading: false,
    });
    useGlobal.mockReturnValue({
      isLoading: false,
      hasFailed: false,
      isSuccess: true,
    });

    render(
      <Provider store={store}>
        <StockListContainer />
      </Provider>
    );

    const title = await screen.findByRole('heading', {
      level: 1,
      name: 'Stock Management',
    });

    expect(title).toBeInTheDocument();

    const addStockSidePanelTitle = screen.getByText('Add Stock');
    expect(addStockSidePanelTitle).toBeInTheDocument();
  });

  it('does not display the AddStockSidePanel when getMedicationListSources is loading', async () => {
    window.featureFlags['medications-general-availability'] = true;
    useGetMedicationListSourcesQuery.mockReturnValue({
      data: null,
      error: false,
      isLoading: true,
    });
    render(
      <Provider store={store}>
        <StockListContainer />
      </Provider>
    );

    const title = await screen.findByRole('heading', {
      level: 1,
      name: 'Stock Management',
    });

    expect(title).toBeInTheDocument();

    const addStockSidePanelTitle = screen.queryByText('Add Stock');
    expect(addStockSidePanelTitle).not.toBeInTheDocument();
  });

  it('displays error when getMedicationListSources fails', async () => {
    window.featureFlags['medications-general-availability'] = true;
    useGetMedicationListSourcesQuery.mockReturnValue({
      data: null,
      error: true,
      isLoading: false,
    });
    render(
      <Provider store={store}>
        <StockListContainer />
      </Provider>
    );

    const title = await screen.findByRole('heading', {
      level: 1,
      name: 'Stock Management',
    });

    expect(title).toBeInTheDocument();

    const addStockSidePanelTitle = screen.queryByText('Add Stock');
    expect(addStockSidePanelTitle).not.toBeInTheDocument();
    expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
  });

  it('renders the filters correctly', () => {
    render(
      <Provider store={store}>
        <StockListContainer />
      </Provider>
    );

    expect(
      screen.getByTestId('StockManagementFilters|DesktopFilters')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('StockManagementFilters|MobileFilters')
    ).toBeInTheDocument();
  });
});
