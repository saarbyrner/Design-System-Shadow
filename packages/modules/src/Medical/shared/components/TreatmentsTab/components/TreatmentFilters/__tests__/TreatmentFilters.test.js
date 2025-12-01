import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';

import TreatmentFilters from '../index';

jest.mock(
  '@kitman/playbook/components/wrappers/CustomDateRangePicker',
  () => () => <div>CustomDateRangePickerStub</div>
);

const props = {
  filter: [],
  hiddenFilters: [],
  squadAthletes: [
    {
      label: 'Squad',
      options: [
        { label: 'Athlete 1', value: 1 },
        { label: 'Athlete 2', value: 2 },
        { label: 'Athlete 3', value: 3 },
      ],
    },
  ],
  squads: [
    {
      label: 'Squad A',
      options: [
        { label: 'Athlete 1', value: 1 },
        { label: 'Athlete 2', value: 2 },
        { label: 'Athlete 3', value: 3 },
      ],
    },
  ],
  onChangeFilter: jest.fn(),
  onClickAddTreatment: jest.fn(),
  onClickCancelReviewing: jest.fn(),
  onClickDownloadTreatment: jest.fn(),
  onClickExportRosterBilling: jest.fn(),
  initialDataRequestStatus: 'SUCCESS',
  canCreateTreatment: true,
  canEditBilling: true,
  showDownloadTreatments: true,
  isReviewMode: false,
  t: i18nextTranslateStub(),
};

beforeEach(() => {
  window.getFlag = jest.fn().mockReturnValue(false);
});

describe('TRIAL ATHLETE - Add treatment button', () => {
  const renderComponent = (
    medicalPermissions = [],
    hiddenFilters = [],
    isReviewMode = false
  ) => {
    render(
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              treatments: {
                canCreate: medicalPermissions.includes('treatments-admin'),
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        <TreatmentFilters
          {...props}
          hiddenFilters={hiddenFilters}
          isReviewMode={isReviewMode}
        />
      </PermissionsContext.Provider>
    );
  };

  it('does render by default when "treatments-admin" permission is present', async () => {
    renderComponent(['treatments-admin']);
    expect(
      screen.getByRole('button', { name: 'Add treatment' })
    ).toBeInTheDocument();
  });

  it('does not render when "treatments-admin" permission is absent', async () => {
    renderComponent([]);
    expect(
      screen.queryByRole('button', { name: 'Add treatment' })
    ).not.toBeInTheDocument();
  });

  it('does not render when hidden by hiddenFilters', async () => {
    renderComponent(['treatments-admin'], ['add_treatment_button']);
    expect(
      screen.queryByRole('button', { name: 'Add treatment' })
    ).not.toBeInTheDocument();
  });

  it('should call onClickAddTreatment when the "Add treatment" button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent(['treatments-admin']);
    const addButton = screen.getByRole('button', { name: 'Add treatment' });
    await user.click(addButton);
    expect(props.onClickAddTreatment).toHaveBeenCalledTimes(1);
  });
});

describe('Save Reviewed Treatments button', () => {
  const renderComponent = (medicalPermissions = [], isReviewMode = false) => {
    render(
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              treatments: {
                canCreate: medicalPermissions.includes('treatments-admin'),
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        <TreatmentFilters {...props} isReviewMode={isReviewMode} />
      </PermissionsContext.Provider>
    );
  };

  it('should render when in review mode and "treatments-admin" permission is present', () => {
    renderComponent(['treatments-admin'], true);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should not render when in review mode but "treatments-admin" permission is absent', () => {
    renderComponent([], true);
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();
  });

  it('should not render when not in review mode, regardless of "treatments-admin" permission', () => {
    renderComponent(['treatments-admin'], false);
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();
  });
});

describe('[feature-flag] pm-date-range-picker-custom', () => {
  afterEach(() => {
    window.getFlag.mockReset();
  });

  it('renders default DateRangePicker when feature flag is disabled', () => {
    render(
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              treatments: { canCreate: true },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        <TreatmentFilters {...props} />
      </PermissionsContext.Provider>
    );

    const labels = screen.getAllByText('Date range');
    expect(labels.length).toBeGreaterThan(1);
    expect(
      screen.queryByText('CustomDateRangePickerStub')
    ).not.toBeInTheDocument();
  });

  it('renders CustomDateRangePicker when feature flag is enabled', () => {
    window.getFlag = jest.fn((flag) => flag === 'pm-date-range-picker-custom');

    render(
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              treatments: { canCreate: true },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        <TreatmentFilters {...props} />
      </PermissionsContext.Provider>
    );

    const stubs = screen.getAllByText('CustomDateRangePickerStub');
    expect(stubs.length).toBeGreaterThan(0);
  });
});
