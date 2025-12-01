import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Header from '..';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');
jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/common/src/redux/global/services/globalApi');

const props = {
  t: i18nextTranslateStub(),
};

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

describe('<StockManagement/> - when FF & permissions.canAdd is off', () => {
  beforeEach(() => {
    window.featureFlags['stock-management'] = false;
  });

  it('renders correct default content with permissions.medical.stockManagement.canAdd false', async () => {
    useGlobal.mockReturnValue({
      isLoading: false,
      hasFailed: false,
      isSuccess: true,
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
            canAdd: false,
            canRemove: true,
          },
        },
      },
      isSuccess: true,
    });
    render(
      <Provider store={store}>
        <Header {...props} />
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Stock Management'
    );

    expect(screen.getByRole('button', { name: 'Print' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Add Stock' })
    ).not.toBeInTheDocument();
  });
});

describe('<StockManagement/> - when FF & permissions.canAdd is on', () => {
  beforeEach(() => {
    window.featureFlags['stock-management'] = true;
  });

  it('renders correct default content with permissions.medical.stockManagement.canAdd true', async () => {
    useGlobal.mockReturnValue({
      isLoading: false,
      hasFailed: false,
      isSuccess: true,
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

    render(
      <Provider store={store}>
        <Header {...props} />
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Stock Management'
    );

    expect(
      screen.getByRole('button', { name: 'Add Stock' })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Print' })).toBeInTheDocument();
  });
});
