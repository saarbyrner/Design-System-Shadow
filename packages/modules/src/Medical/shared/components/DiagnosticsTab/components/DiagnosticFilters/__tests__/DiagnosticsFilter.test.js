import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { defaultMedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical';
import { getDefaultDiagnosticFilters } from '../../../../../utils';
import DiagnosticFilters from '../index';

jest.mock(
  '@kitman/playbook/components/wrappers/CustomDateRangePicker',
  () => () => <div>CustomDateRangePickerStub</div>
);

beforeEach(() => {
  window.getFlag = jest.fn().mockReturnValue(false);
});

const defaultFilters = getDefaultDiagnosticFilters({
  athleteId: null,
});

const defaultProps = {
  filters: defaultFilters,
  squads: [],
  onChangeFilter: jest.fn(),
  onClickAddDiagnostic: jest.fn(),
  onClickDownloadDiagnostics: jest.fn(),
  onClickExportRosterBilling: jest.fn(),
  showDownloadDiagnostics: true,
  toasts: [
    {
      id: 1,
      status: 'SUCCESS',
      title: 'Test Title',
      description: 'This is a test description',
      links: [
        {
          id: 1,
          text: 'Try Again',
          link: '#',
          withHashParam: true,
          metadata: {
            action: 'RETRY_REQUEST',
          },
        },
      ],
    },
  ],
  toastAction: jest.fn(),
  hiddenFilters: [],
  t: (key) => key,
};

const defaultPermissions = {
  medical: {
    ...defaultMedicalPermissions,
  },
  userMovement: { player: { medicalTrial: false } },
};

const renderTestComponent = (props, permissions = defaultPermissions) =>
  render(
    <MockedPermissionContextProvider
      permissionsContext={{ ...DEFAULT_CONTEXT_VALUE, permissions }}
    >
      <DiagnosticFilters {...defaultProps} {...props} />
    </MockedPermissionContextProvider>
  );

describe('<DiagnosticFilters />', () => {
  it('renders the correct content on load', () => {
    renderTestComponent();

    const filtersWrapper = document.querySelector('div[class$="-filters"]');
    const tabletFiltersWrapper = document.querySelector(
      'div[class$="-tabletFilters"]'
    );
    const mobileFiltersWrapper = document.querySelector(
      'div[class$="-mobileFilters"]'
    );
    const PACSViewerButton = screen.queryByText('PACS viewer');

    expect(filtersWrapper).toBeInTheDocument();
    expect(tabletFiltersWrapper).toBeInTheDocument();
    expect(mobileFiltersWrapper).toBeInTheDocument();
    expect(PACSViewerButton).not.toBeInTheDocument(); // needs FF and permission

    expect(
      filtersWrapper?.querySelectorAll('div[class$="-filter"]').length
    ).toEqual(2);

    expect(
      filtersWrapper?.querySelector('input[placeholder="Search"]')
    ).toBeInTheDocument();

    expect(
      filtersWrapper?.querySelector('div[class$="-renderDateFilter"]')
    ).toBeInTheDocument();

    expect(
      filtersWrapper?.querySelector(
        'div[data-testid="DiagnosticFilters|SquadFilter"]'
      )
    ).toBeInTheDocument();
  });

  it('renders the Type filter correctly', async () => {
    const types = [
      { value: 'labs', label: 'Labs' },
      { value: 'imaging', label: 'Imaging' },
    ];

    renderTestComponent({
      ...defaultProps,
      isRedoxOrg: true,
      diagnostics: [],
      diagnosticResultTypes: types,
    });

    const typeFilter = screen.getAllByTestId(
      'DiagnosticFilters|ResultTypeFilter'
    )[0];

    selectEvent.openMenu(typeFilter.querySelector('.kitmanReactSelect input'));

    types.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('hides the mobile filters sliding panel when on desktop', () => {
    renderTestComponent();

    const mobileFiltersWrapper = document.querySelector(
      'div[class$="-mobileFilters"]'
    );

    const slidingPanel = mobileFiltersWrapper?.querySelector(
      'div[data-testid="sliding-panel"]'
    );

    expect(slidingPanel?.className.includes('Closed')).toBeTruthy();
  });

  describe('hidden filters', () => {
    it('hides the squad filter if squads is present in hiddenFilters', () => {
      renderTestComponent({ hiddenFilters: ['squads'] });

      const filtersWrapper = document.querySelector('div[class$="-filters"]');

      expect(
        filtersWrapper?.querySelector(
          'div[data-testid="DiagnosticFilters|SquadFilter"]'
        )
      ).toBeFalsy();
    });
  });

  describe('[permission] permissions.medical.diagnostics.canCreate', () => {
    it('renders the correct content on load', () => {
      renderTestComponent(
        {},
        {
          ...defaultPermissions,
          medical: {
            ...defaultMedicalPermissions,
            diagnostics: {
              ...defaultMedicalPermissions.diagnostics,
              canCreate: true,
            },
          },
        }
      );

      expect(screen.getByText('Add diagnostic')).toBeInTheDocument();
    });
  });

  describe('when medical-diagnostics-iteration-3-billing-cpt feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['medical-diagnostics-iteration-3-billing-cpt'] = true;
    });
    afterEach(() => {
      window.featureFlags[
        'medical-diagnostics-iteration-3-billing-cpt'
      ] = false;
    });

    describe('[permission] when the user has permissions.medical.issues.canExport', () => {
      it('calls the correct function when clicking the Export billing action', async () => {
        renderTestComponent(
          {},
          {
            ...defaultPermissions,
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: true,
              },
            },
          }
        );

        expect(screen.getByText('Export billing')).toBeInTheDocument();

        await userEvent.click(screen.getByText('Export billing'));

        await waitFor(() => {
          expect(defaultProps.onClickDownloadDiagnostics).toHaveBeenCalledTimes(
            1
          );
        });
      });

      it('does not show the export billing button if showDownloadDiagnostics is false', () => {
        renderTestComponent(
          { showDownloadDiagnostics: false },
          {
            ...defaultPermissions,
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: true,
              },
            },
          }
        );

        expect(screen.queryByText('Export billing')).not.toBeInTheDocument();
      });
    });

    describe('[permission] when the user does not have permissions.medical.issues.canExport', () => {
      it('does not show the export billing button', () => {
        renderTestComponent(
          {},
          {
            ...defaultPermissions,
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: false,
              },
            },
          }
        );

        expect(screen.queryByText('Export billing')).not.toBeInTheDocument();
      });

      it('does not show the export billing button if showDownloadDiagnostics is false', () => {
        renderTestComponent(
          { showDownloadDiagnostics: false },
          {
            ...defaultPermissions,
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: false,
              },
            },
          }
        );

        expect(screen.queryByText('Export billing')).not.toBeInTheDocument();
      });
    });
  });

  describe('when export-billing-buttons-team-level feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['export-billing-buttons-team-level'] = true;
    });
    afterEach(() => {
      window.featureFlags['export-billing-buttons-team-level'] = false;
    });

    describe('[permission] when the user has permissions.medical.issues.canExport', () => {
      it('calls the correct function when clicking the Export billing action', async () => {
        renderTestComponent(
          { showDownloadDiagnostics: false },
          {
            ...defaultPermissions,
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: true,
              },
            },
          }
        );

        expect(screen.queryByText('Export billing')).toBeInTheDocument();

        await userEvent.click(screen.getByText('Export billing'));

        await waitFor(() => {
          expect(defaultProps.onClickExportRosterBilling).toHaveBeenCalledTimes(
            1
          );
        });
      });

      it('does not show the export billing button if showDownloadDiagnostics is true', () => {
        renderTestComponent(
          { showDownloadDiagnostics: true },
          {
            ...defaultPermissions,
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: true,
              },
            },
          }
        );

        expect(screen.queryByText('Export billing')).not.toBeInTheDocument();
      });
    });

    describe('[permission] when the user does not have permissions.medical.issues.canExport', () => {
      it('does not show the export billing button', () => {
        renderTestComponent(
          { showDownloadDiagnostics: false },
          {
            ...defaultPermissions,
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: false,
              },
            },
          }
        );

        expect(screen.queryByText('Export billing')).not.toBeInTheDocument();
      });

      it('does not show the export billing button if showDownloadDiagnostics is true', () => {
        renderTestComponent(
          { showDownloadDiagnostics: true },
          {
            ...defaultPermissions,
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: false,
              },
            },
          }
        );

        expect(screen.queryByText('Export billing')).not.toBeInTheDocument();
      });
    });
  });

  describe('diagnostics actions', () => {
    it('calls the correct function when clicking the Add diagnostic action', async () => {
      renderTestComponent(
        {},
        {
          ...defaultPermissions,
          medical: {
            ...defaultMedicalPermissions,
            diagnostics: {
              ...defaultMedicalPermissions.diagnostics,
              canCreate: true,
            },
          },
        }
      );

      await userEvent.click(screen.getByText('Add diagnostic'));

      await waitFor(() => {
        expect(defaultProps.onClickAddDiagnostic).toHaveBeenCalledTimes(1);
      });
    });

    it('calls the correct function when typing', async () => {
      renderTestComponent();

      const filtersWrapper = document.querySelector('div[class$="-filters"]');

      fireEvent.change(
        filtersWrapper?.querySelector('input[placeholder="Search"]'),
        { target: { value: 'search text' } }
      );

      await waitFor(() => {
        expect(defaultProps.onChangeFilter).toHaveBeenCalledWith({
          ...defaultFilters,
          search_expression: 'search text',
        });
      });
    });
  });

  it('renders toast correctly', async () => {
    renderTestComponent();

    window.featureFlags['diagnostics-tab-bulk-actions'] = true;

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();

    window.featureFlags['diagnostics-tab-bulk-actions'] = false;
  });

  const renderWithHiddenFilters = (hiddenFilters = []) => {
    renderTestComponent(
      { hiddenFilters, isRedoxOrg: true, diagnostics: [] },
      {
        ...defaultPermissions,
        medical: {
          ...defaultMedicalPermissions,
          diagnostics: {
            ...defaultMedicalPermissions.diagnostics,
            canCreate: true,
          },
        },
      }
    );
  };

  describe('TRIAL ATHLETE - Add diagnostic button', () => {
    it('does render the with the correct permissions', async () => {
      renderWithHiddenFilters([]);
      expect(
        screen.getByRole('button', { name: 'Add diagnostic' })
      ).toBeInTheDocument();
    });
    it('does not render when hidden', async () => {
      renderWithHiddenFilters(['add_diagnostic_button']);

      expect(() =>
        screen.getByRole('button', { name: 'Add diagnostic' })
      ).toThrow();
    });
  });

  describe('TRIAL ATHLETE - Save button', () => {
    it('does render the with the correct permissions', async () => {
      renderWithHiddenFilters([]);
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });
    it('does not render when hidden', async () => {
      renderWithHiddenFilters(['save_diagnostic_button']);

      expect(() => screen.getByRole('button', { name: 'Save' })).toThrow();
    });
  });
});

describe('[feature-flag] medical-diagnostics-ambra', () => {
  beforeEach(() => {
    window.featureFlags['medical-diagnostics-ambra'] = true;
  });
  afterAll(() => {
    window.featureFlags['medical-diagnostics-ambra'] = false;
  });

  it('renders PACS buttons correctly on desktop', () => {
    renderTestComponent();

    const PACSViewerButton = screen.getByRole('button', {
      name: 'PACS viewer',
    });
    const PACSUploaderButton = screen.getByRole('button', {
      name: 'PACS uploader',
    });

    expect(PACSViewerButton).toBeInTheDocument();
    expect(PACSUploaderButton).toBeInTheDocument();
  });

  it('renders PACS buttons correctly on mobile', async () => {
    renderTestComponent();

    const ambraUrl = /^https:\/\/nfl.ambrahealth.com\/api\/v3/;

    const tooltipMenuButton = document.querySelector(
      'div[class$="-titleContainer"] .icon-more'
    );

    await userEvent.click(tooltipMenuButton);

    const PACSViewerLink = screen.getByRole('link', {
      name: 'PACS Viewer',
    });
    const PACSUploaderLink = screen.getByRole('link', {
      name: 'PACS Uploader',
    });

    expect(PACSViewerLink).toBeInTheDocument();
    expect(PACSViewerLink).toHaveClass('tooltipMenu__item');
    expect(PACSViewerLink.href).toMatch(ambraUrl);

    expect(PACSUploaderLink).toBeInTheDocument();
    expect(PACSUploaderLink).toHaveClass('tooltipMenu__item');
    expect(PACSUploaderLink.href).toMatch(ambraUrl);
  });
});

describe('<DiagnosticFilters with Feature flag ON and athlete not on medical trial/>', () => {
  beforeEach(() => {
    window.featureFlags['medical-diagnostics-ambra'] = true;
  });
  afterAll(() => {
    window.featureFlags['medical-diagnostics-ambra'] = false;
  });

  it('renders the PACS buttons', () => {
    renderTestComponent(
      {},
      {
        ...defaultPermissions,
        userMovement: { player: { medicalTrial: false } },
      }
    );

    const PACSViewerButton = screen.getByRole('button', {
      name: 'PACS viewer',
    });
    const PACSUploaderButton = screen.getByRole('button', {
      name: 'PACS uploader',
    });

    expect(PACSViewerButton).toBeInTheDocument();
    expect(PACSUploaderButton).toBeInTheDocument();
  });
});

describe('<DiagnosticFilters with Feature flag ON and athlete on trial />', () => {
  beforeEach(() => {
    window.featureFlags['medical-diagnostics-ambra'] = true;
  });
  afterAll(() => {
    window.featureFlags['medical-diagnostics-ambra'] = false;
  });

  it('does not render the PACS buttons', () => {
    renderTestComponent({
      athleteData: { constraints: { organisation_status: 'TRIAL_ATHLETE' } },
    });

    const PACSViewerButton = screen.queryByRole('button', {
      name: 'PACS viewer',
    });
    const PACSUploaderButton = screen.queryByRole('button', {
      name: 'PACS uploader',
    });

    expect(PACSViewerButton).not.toBeInTheDocument();
    expect(PACSUploaderButton).not.toBeInTheDocument();
  });
});

describe('<DiagnosticFilters with Feature flag OFF and athlete on trial />', () => {
  beforeEach(() => {
    window.featureFlags['medical-diagnostics-ambra'] = false;
  });

  it('does not render the PACS buttons', () => {
    renderTestComponent(
      {},
      {
        ...defaultPermissions,
        userMovement: { player: { medicalTrial: true } },
      }
    );

    const PACSViewerButton = screen.queryByRole('button', {
      name: 'PACS viewer',
    });
    const PACSUploaderButton = screen.queryByRole('button', {
      name: 'PACS uploader',
    });

    expect(PACSViewerButton).not.toBeInTheDocument();
    expect(PACSUploaderButton).not.toBeInTheDocument();
  });
});

describe('<DiagnosticFilters with Feature flag OFF and athlete not on trial />', () => {
  beforeEach(() => {
    window.featureFlags['medical-diagnostics-ambra'] = false;
  });

  it('does not render the PACS buttons', () => {
    renderTestComponent(
      {},
      {
        ...defaultPermissions,
        userMovement: { player: { medicalTrial: true } },
      }
    );

    const PACSViewerButton = screen.queryByRole('button', {
      name: 'PACS viewer',
    });
    const PACSUploaderButton = screen.queryByRole('button', {
      name: 'PACS uploader',
    });

    expect(PACSViewerButton).not.toBeInTheDocument();
    expect(PACSUploaderButton).not.toBeInTheDocument();
  });
});

describe('[feature-flag] pm-date-range-picker-custom', () => {
  afterEach(() => window.getFlag.mockReset());

  it('renders default DateRangePicker when feature flag is disabled', () => {
    renderTestComponent();
    expect(
      screen.queryByText('CustomDateRangePickerStub')
    ).not.toBeInTheDocument();
  });

  it('renders CustomDateRangePicker when feature flag is enabled', () => {
    window.getFlag = jest.fn((flag) => flag === 'pm-date-range-picker-custom');
    renderTestComponent();
    const stubs = screen.getAllByText('CustomDateRangePickerStub');
    expect(stubs.length).toBeGreaterThan(0);
  });
});
