import { render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { Provider } from 'react-redux';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import ProceduresFilter from '../ProceduresFilters';

jest.mock(
  '@kitman/playbook/components/wrappers/CustomDateRangePicker',
  () => () => <div>CustomDateRangePickerStub</div>
);

beforeEach(() => {
  window.getFlag = jest.fn().mockReturnValue(false);
});

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
  addProcedureSidePanel: {
    isOpen: true,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  medicalHistory: {},
});

const props = {
  proceduresFilterData: {
    locations: [{ id: 1, name: 'Test location' }],
    procedure_reasons: [{ id: 1, name: 'Test reason' }],
  },
  squads: [
    { label: 'Academy Squad', value: 2 },
    { label: 'International Squad', value: 3 },
  ],
  onChangeFilter: jest.fn(),
  initialDataRequest: ['PENDING'],
  hiddenFilters: [],
  filters: {
    athlete_id: 21,
    search_expression: '',
    squad_ids: [6],
    position_ids: [2, 3],
  },
  t: i18nextTranslateStub(),
};

describe('<ProceduresFilter/>', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    window.featureFlags['medical-procedures'] = true;

    storeFake({
      medicalApi: {},
      medicalHistory: {},
    });
    store.dispatch = dispatchSpy;
  });

  describe('renders filters', () => {
    it('populates Roster select', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                procedures: {
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ProceduresFilter {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      const selectModeContainer = screen.getAllByTestId(
        'ProceduresFilters|RosterFilter'
      )[0];

      selectEvent.openMenu(
        selectModeContainer.querySelector('.kitmanReactSelect input')
      );

      expect(screen.getByText('Academy Squad')).toBeInTheDocument();
      expect(screen.getByText('International Squad')).toBeInTheDocument();
    });
    it('populates Location select', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                procedures: {
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ProceduresFilter {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      const selectModeContainer = screen.getAllByTestId(
        'ProceduresFilters|CompanyFilter'
      )[0];

      selectEvent.openMenu(
        selectModeContainer.querySelector('.kitmanReactSelect input')
      );

      expect(screen.getByText('Test location')).toBeInTheDocument();
    });
    it('populates Reason select', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                procedures: {
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <ProceduresFilter {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      const selectModeContainer = screen.getAllByTestId(
        'ProceduresFilters|ReasonFilter'
      )[0];

      selectEvent.openMenu(
        selectModeContainer.querySelector('.kitmanReactSelect input')
      );

      expect(screen.getByText('Test reason')).toBeInTheDocument();
    });
  });
});

describe('TRIAL ATHLETE - Add procedure button', () => {
  const renderWithHiddenFilters = (hiddenFilters = []) => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={{
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              procedures: {
                canView: true,
              },
            },
          },
        }}
      >
        <Provider store={store}>
          <ProceduresFilter {...props} hiddenFilters={hiddenFilters} />
        </Provider>
      </MockedPermissionContextProvider>
    );
  };
  it('does render by default', async () => {
    renderWithHiddenFilters([]);
    expect(
      screen.getByRole('button', { name: 'Add procedure' })
    ).toBeInTheDocument();
  });
  it('does not render when hidden', async () => {
    renderWithHiddenFilters(['add_procedure_button']);

    expect(() =>
      screen.getByRole('button', { name: 'Add procedure' })
    ).toThrow();
  });
});

describe('[feature-flag] pm-date-range-picker-custom', () => {
  afterEach(() => window.getFlag.mockReset());

  it('renders default DateRangePicker when feature flag is disabled', () => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={{
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              procedures: { canView: true },
            },
          },
        }}
      >
        <Provider store={store}>
          <ProceduresFilter {...props} />
        </Provider>
      </MockedPermissionContextProvider>
    );
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(
      screen.queryByText('CustomDateRangePickerStub')
    ).not.toBeInTheDocument();
  });

  it('renders CustomDateRangePicker when feature flag is enabled', () => {
    window.getFlag = jest.fn((flag) => flag === 'pm-date-range-picker-custom');
    render(
      <MockedPermissionContextProvider
        permissionsContext={{
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              procedures: { canView: true },
            },
          },
        }}
      >
        <Provider store={store}>
          <ProceduresFilter {...props} />
        </Provider>
      </MockedPermissionContextProvider>
    );
    expect(screen.getByText('CustomDateRangePickerStub')).toBeInTheDocument();
  });
});
