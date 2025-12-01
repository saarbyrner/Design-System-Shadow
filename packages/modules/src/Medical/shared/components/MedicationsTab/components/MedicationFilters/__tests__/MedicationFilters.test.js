import { render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { useGetMedicationProvidersQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import MedicationFilters from '..';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetMedicationProvidersQuery: jest.fn(),
}));

jest.mock(
  '@kitman/playbook/components/wrappers/CustomDateRangePicker',
  () => () => <div>MockCustomDateRangePicker</div>
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {
    useGetMedicationProvidersQuery: jest.fn(),
  },
  medicalHistory: {},
});

describe('<MedicationFilters/>', () => {
  // Add beforeEach and afterEach for feature flag setup
  beforeEach(() => {
    window.featureFlags = window.featureFlags || {};
    window.featureFlags['stock-management'] = true;
    window.getFlag = jest.fn(() => false); // Default to false for pm-date-range-picker-custom
  });

  afterEach(() => {
    delete window.featureFlags['stock-management'];
    delete window.getFlag;
  });

  const dispatchSpy = sinon.spy();

  beforeEach(() => {
    storeFake({
      medicalApi: {
        useGetMedicationProvidersQuery: jest.fn(),
      },
      medicalHistory: {},
    });
    store.dispatch = dispatchSpy;
  });

  const props = {
    onChangeFilter: jest.fn(),
    filters: {
      athlete_id: 21,
      search_expression: '',
      squad_ids: [],
      position_ids: [],
      status: ['active'],
      provider: [],
    },
    t: i18nextTranslateStub(),
  };

  describe('renders filters', () => {
    beforeEach(() => {
      window.featureFlags['stock-management'] = true;
      useGetMedicationProvidersQuery.mockReturnValue({
        data: [],
      });
    });
    afterEach(() => {
      window.featureFlags['stock-management'] = false;
    });

    it('contains action buttons', async () => {
      render(
        <Provider store={store}>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  stockManagement: {
                    ...defaultMedicalPermissions.stockManagement,
                    canDispense: true,
                    canView: true,
                  },
                },
              },
            }}
          >
            <MedicationFilters {...props} />
          </MockedPermissionContextProvider>
        </Provider>
      );

      expect(
        screen.getByRole('button', { name: 'Add medication' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Stock Management' })
      ).toBeInTheDocument();
    });

    it('uses permissions to render action buttons', async () => {
      render(
        <Provider store={store}>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  stockManagement: {
                    ...defaultMedicalPermissions.stockManagement,
                    canDispense: false,
                    canView: false,
                  },
                },
              },
            }}
          >
            <MedicationFilters {...props} />
          </MockedPermissionContextProvider>
        </Provider>
      );
      expect(screen.queryByText('Stock Management')).not.toBeInTheDocument();
      expect(screen.queryByText('Dispense')).not.toBeInTheDocument();
    });

    it('populates Provider select', async () => {
      useGetMedicationProvidersQuery.mockReturnValue({
        data: [
          { value: 'provider_john-doe', label: 'John Doe' },
          { value: 'provider_jane-doe', label: 'Jane Doe' },
        ],
      });

      render(
        <Provider store={store}>
          <MedicationFilters {...props} />
        </Provider>
      );
      await new Promise((r) => setTimeout(r, 5000));

      const selectModeContainer = screen.getAllByTestId(
        'MedicationFilters|ProviderFilter'
      )[0];

      selectEvent.openMenu(
        selectModeContainer.querySelector('.kitmanReactSelect input')
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('populates Status select', async () => {
      render(
        <Provider store={store}>
          <MedicationFilters {...props} />
        </Provider>
      );

      const selectModeContainer = screen.getAllByTestId(
        'MedicationFilters|StatusFilter'
      )[0];

      selectEvent.openMenu(
        selectModeContainer.querySelector('.kitmanReactSelect input')
      );

      expect(screen.getByText('Paused')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
      expect(screen.getAllByText('Active')[3]).toBeInTheDocument();
      // multiple instances of active so have to pick out the specific select option
    });
  });

  describe('Check permissions', () => {
    beforeEach(() => {
      window.featureFlags['stock-management'] = true;
      useGetMedicationProvidersQuery.mockReturnValue({
        data: [],
      });
    });
    afterEach(() => {
      window.featureFlags['stock-management'] = false;
    });

    const renderWithPermissions = (
      canDispenseStock,
      canLogMedications,
      canViewStockManagement
    ) => {
      render(
        <Provider store={store}>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  stockManagement: {
                    ...defaultMedicalPermissions.stockManagement,
                    canDispense: canDispenseStock,
                    canView: canViewStockManagement,
                  },
                  medications: {
                    ...defaultMedicalPermissions.medications,
                    canLog: canLogMedications,
                    canView: true,
                  },
                },
              },
            }}
          >
            <MedicationFilters {...props} hiddenFilters={[]} />
          </MockedPermissionContextProvider>
        </Provider>
      );
    };

    it('does not render "Add medication" or "Stock Management" without permissions', async () => {
      renderWithPermissions(false, false, false);
      expect(
        screen.queryByRole('button', { name: 'Add medication' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Stock Management' })
      ).not.toBeInTheDocument();
    });

    it('renders "Add medication" with canDispenseStock permission', async () => {
      renderWithPermissions(true, false, false);
      expect(
        screen.getByRole('button', { name: 'Add medication' })
      ).toBeInTheDocument();
    });

    it('renders "Add medication" with canLogMedications permission', async () => {
      renderWithPermissions(false, true, false);
      expect(
        screen.getByRole('button', { name: 'Add medication' })
      ).toBeInTheDocument();
    });

    it('renders "Stock Management" with canLogMedications permission', async () => {
      renderWithPermissions(false, false, true);
      expect(
        screen.getByRole('button', { name: 'Stock Management' })
      ).toBeInTheDocument();
    });
  });

  describe('TRIAL ATHLETE - Add medication button', () => {
    beforeEach(() => {
      window.featureFlags['stock-management'] = true;
    });
    afterEach(() => {
      window.featureFlags['stock-management'] = false;
    });

    const renderWithHiddenFilters = (hiddenFilters = []) => {
      render(
        <Provider store={store}>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  stockManagement: {
                    ...defaultMedicalPermissions.stockManagement,
                    canDispense: true,
                    canView: true,
                  },
                },
              },
            }}
          >
            <MedicationFilters {...props} hiddenFilters={hiddenFilters} />
          </MockedPermissionContextProvider>
        </Provider>
      );
    };

    it('does render by default', async () => {
      renderWithHiddenFilters([]);

      expect(
        screen.getByRole('button', { name: 'Add medication' })
      ).toBeInTheDocument();
    });

    it('does not render when hidden', async () => {
      renderWithHiddenFilters(['add_medication_button']);

      expect(
        screen.queryByRole('button', { name: 'Add medication' })
      ).not.toBeInTheDocument();
    });
  });

  describe('TRIAL ATHLETE - Stock Management button', () => {
    beforeEach(() => {
      window.featureFlags['stock-management'] = true;
    });
    afterEach(() => {
      window.featureFlags['stock-management'] = false;
    });
    const renderWithHiddenFilters = (hiddenFilters = []) => {
      render(
        <Provider store={store}>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  stockManagement: {
                    ...defaultMedicalPermissions.stockManagement,
                    canDispense: true,
                    canView: true,
                  },
                },
              },
            }}
          >
            <MedicationFilters {...props} hiddenFilters={hiddenFilters} />
          </MockedPermissionContextProvider>
        </Provider>
      );
    };
    it('does render by default', async () => {
      renderWithHiddenFilters([]);
      expect(
        screen.getByRole('button', { name: 'Stock Management' })
      ).toBeInTheDocument();
    });
    it('does not render when hidden', async () => {
      renderWithHiddenFilters(['stock_management_button']);

      expect(
        screen.queryByRole('button', { name: 'Stock Management' })
      ).not.toBeInTheDocument();
    });
  });

  // Add a new test for a date range picker feature flag
  
  describe('DateRangePicker behavior', () => {
    it('renders default DateRangePicker when feature flag is OFF', () => {
      window.getFlag = jest.fn(() => false);

      render(
        <Provider store={store}>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  stockManagement: {
                    ...defaultMedicalPermissions.stockManagement,
                    canDispense: true,
                    canView: true,
                  },
                },
              },
            }}
          >
            <MedicationFilters {...props} />
          </MockedPermissionContextProvider>
        </Provider>
      );

      expect(screen.getAllByText('Date range').length).toBeGreaterThan(0);
      expect(
        screen.queryByText('MockCustomDateRangePicker')
      ).not.toBeInTheDocument();
    });

    it('renders CustomDateRangePicker when feature flag is ON', () => {
      window.getFlag = jest.fn(() => true);

      render(
        <Provider store={store}>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  stockManagement: {
                    ...defaultMedicalPermissions.stockManagement,
                    canDispense: true,
                    canView: true,
                  },
                },
              },
            }}
          >
            <MedicationFilters {...props} />
          </MockedPermissionContextProvider>
        </Provider>
      );

      expect(screen.queryByText('Date range')).not.toBeInTheDocument();
      expect(
        screen.getAllByText('MockCustomDateRangePicker').length
      ).toBeGreaterThan(0);
    });
  });
});
