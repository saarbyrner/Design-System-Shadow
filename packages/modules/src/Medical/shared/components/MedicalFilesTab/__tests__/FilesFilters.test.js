import { render, screen, within } from '@testing-library/react';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  ADD_MEDICAL_FILE_BUTTON,
  SCAN_BUTTON,
} from '@kitman/modules/src/Medical/shared/constants/elementTags';
import FilesFilters from '../FilesFilters';

import {
  categoryOptions,
  filesSourceOptions,
  fileTypeOptions,
  playerOptions,
} from '../../MedicalDocumentsTab/__tests__/mocks/documentsFilterData';

jest.mock(
  '@kitman/playbook/components/wrappers/CustomDateRangePicker',
  () => () => <div>MockCustomDateRangePicker</div>
);

const store = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
  medicalApi: {},
});

const props = {
  setIsPanelOpen: jest.fn(),
  playerOptions,
  categoryOptions,
  filesSourceOptions,
  fileTypeOptions,
  initialDataRequestStatus: null,
  showPlayerFilter: true,
  filters: {
    athlete_id: null,
    filename: '',
    document_date: null,
    document_category_ids: [],
    archived: false,
    issue_occurrence: null,
  },
  enhancedFilters: {},
  setFilters: jest.fn(),
  showArchivedDocuments: false,
  onExportClick: jest.fn(),
  exportAttachments: [
    { id: 3, filetype: 'three.png' },
    { id: 4, filetype: 'four.png' },
    { id: 90, filetype: 'ninety.png' },
  ],
  onScanClick: jest.fn(),
  atIssueLevel: false,
  t: i18nextTranslateStub(),
};

const renderComponent = (additionalProps, permissionsContext = null) => {
  const Component = (
    <Provider store={store}>
      {permissionsContext ? (
        <MockedPermissionContextProvider
          permissionsContext={permissionsContext}
        >
          <FilesFilters {...props} {...additionalProps} />
        </MockedPermissionContextProvider>
      ) : (
        <FilesFilters {...props} {...additionalProps} />
      )}
    </Provider>
  );

  return render(Component);
};

describe('<FilesFilters/>', () => {
  describe('[feature-flag] medical-files-tab-enhancement false', () => {
    beforeEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
    });

    it('renders desktop filters with player filter', () => {
      renderComponent({ showPlayerFilter: true });
      const desktopFilters = within(
        screen.getByTestId('FilesFilters|DesktopFilters')
      );
      expect(desktopFilters.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(desktopFilters.getByText('Date range')).toBeInTheDocument();
      expect(desktopFilters.getByText('Player')).toBeInTheDocument();
      expect(desktopFilters.getByText('Categories')).toBeInTheDocument();
      expect(desktopFilters.queryByText('File type')).not.toBeInTheDocument();
      expect(desktopFilters.queryByText('Source')).not.toBeInTheDocument();
      expect(
        desktopFilters.getByTestId('FilesFilters|PlayerSelect')
      ).toBeInTheDocument();
    });

    it('renders desktop filters without player filter', () => {
      renderComponent({ showPlayerFilter: false });
      const desktopFilters = within(
        screen.getByTestId('FilesFilters|DesktopFilters')
      );
      expect(desktopFilters.queryByText('Player')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('FilesFilters|PlayerSelect')
      ).not.toBeInTheDocument();
    });

    it('renders mobile filters with player filter', () => {
      renderComponent({ showPlayerFilter: true });
      const mobileFilters = within(
        screen.getByTestId('FilesFilters|MobileFilters')
      );
      expect(mobileFilters.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(mobileFilters.getByText('Date range')).toBeInTheDocument();
      expect(mobileFilters.getByText('Player')).toBeInTheDocument();
      expect(mobileFilters.getByText('Categories')).toBeInTheDocument();
      expect(mobileFilters.queryByText('File type')).not.toBeInTheDocument();
      expect(mobileFilters.queryByText('Source')).not.toBeInTheDocument();
      expect(
        mobileFilters.getByTestId('FilesFilters|PlayerSelect')
      ).toBeInTheDocument();
    });

    it('renders mobile filters without player filter', () => {
      renderComponent({ showPlayerFilter: false });
      const mobileFilters = within(
        screen.getByTestId('FilesFilters|MobileFilters')
      );
      expect(mobileFilters.queryByText('Player')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('FilesFilters|PlayerSelect')
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] medical-files-tab-enhancement true', () => {
    beforeEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = true;
    });
    afterEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
    });

    it('renders desktop filters with player filter', () => {
      renderComponent({ showPlayerFilter: true });
      const desktopFilters = within(
        screen.getByTestId('FilesFilters|DesktopFilters')
      );
      expect(desktopFilters.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(desktopFilters.getByText('Date range')).toBeInTheDocument();
      expect(desktopFilters.getByText('Player')).toBeInTheDocument();
      expect(desktopFilters.getByText('Categories')).toBeInTheDocument();
      expect(desktopFilters.getByText('File type')).toBeInTheDocument();
      expect(desktopFilters.getByText('Source')).toBeInTheDocument();

      expect(
        desktopFilters.getByTestId('FilesFilters|PlayerSelect')
      ).toBeInTheDocument();
    });

    it('renders desktop filters without player filter', () => {
      renderComponent({ showPlayerFilter: false });
      const desktopFilters = within(
        screen.getByTestId('FilesFilters|DesktopFilters')
      );
      expect(desktopFilters.queryByText('Player')).not.toBeInTheDocument();
      expect(
        desktopFilters.queryByTestId('FilesFilters|PlayerSelect')
      ).not.toBeInTheDocument();
    });

    it('renders mobile filters with player filter', () => {
      renderComponent({ showPlayerFilter: true });
      const mobileFilters = within(
        screen.getByTestId('FilesFilters|MobileFilters')
      );
      expect(mobileFilters.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(mobileFilters.getByText('Date range')).toBeInTheDocument();
      expect(mobileFilters.getByText('Player')).toBeInTheDocument();
      expect(mobileFilters.getByText('Categories')).toBeInTheDocument();
      expect(mobileFilters.getByText('File type')).toBeInTheDocument();
      expect(mobileFilters.getByText('Source')).toBeInTheDocument();
      expect(
        mobileFilters.getByTestId('FilesFilters|PlayerSelect')
      ).toBeInTheDocument();
    });

    it('renders mobile filters without player filter', () => {
      renderComponent({ showPlayerFilter: false });
      const mobileFilters = within(
        screen.getByTestId('FilesFilters|MobileFilters')
      );
      expect(mobileFilters.queryByText('Player')).not.toBeInTheDocument();
      expect(
        mobileFilters.queryByTestId('FilesFilters|PlayerSelect')
      ).not.toBeInTheDocument();
    });

    it('renders expected select options and calls callbacks', async () => {
      renderComponent();

      const desktopFilters = within(
        screen.getByTestId('FilesFilters|DesktopFilters')
      );

      // ======== SELECT PLAYER ========

      const playerSelect = desktopFilters.getByTestId(
        'FilesFilters|PlayerSelect'
      );
      selectEvent.openMenu(
        playerSelect.querySelector('.kitmanReactSelect input')
      );
      expect(screen.getByText('Test Squad')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Test Squad'));
      expect(screen.getByText('Athlete 1')).toBeInTheDocument();
      expect(screen.getByText('Athlete 2')).toBeInTheDocument();

      await userEvent.click(screen.getByText('Athlete 2'));
      expect(props.setFilters).toHaveBeenCalledWith({
        entity_athlete_id: 2,
      });

      // ======== SELECT CATEGORY ========

      const categorySelect = desktopFilters.getByTestId(
        'FilesFilters|CategorySelect'
      );
      selectEvent.openMenu(
        categorySelect.querySelector('.kitmanReactSelect input')
      );
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();

      await userEvent.click(screen.getByText('Category 2'));
      expect(props.setFilters).toHaveBeenCalledWith({
        medical_attachment_category_ids: [2],
      });

      // ======== SELECT FILETYPE ========

      const fileTypeSelect = desktopFilters.getByTestId(
        'FilesFilters|FileTypeSelect'
      );
      selectEvent.openMenu(
        fileTypeSelect.querySelector('.kitmanReactSelect input')
      );
      expect(screen.getByText('File Type 1')).toBeInTheDocument();
      expect(screen.getByText('File Type 2')).toBeInTheDocument();

      await userEvent.click(screen.getByText('File Type 2'));
      expect(props.setFilters).toHaveBeenCalledWith({
        file_types: [2],
      });

      // ======== SELECT SOURCE ========

      const sourceSelect = desktopFilters.getByTestId(
        'FilesFilters|SourceSelect'
      );
      selectEvent.openMenu(
        sourceSelect.querySelector('.kitmanReactSelect input')
      );
      expect(screen.getByText('Source 1')).toBeInTheDocument();
      expect(screen.getByText('Source 2')).toBeInTheDocument();

      await userEvent.click(screen.getByText('Source 2'));
      expect(props.setFilters).toHaveBeenCalledWith({
        entity_types: [2],
      });
    });
  });

  it('does not show the Add document button when showArchivedDocuments', () => {
    const mockedPermissionsContextValue = {
      permissions: {
        medical: {
          documents: {
            canView: true,
            canCreate: true,
          },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    };

    renderComponent(
      { showArchivedDocuments: true },
      mockedPermissionsContextValue
    );

    const addDocumentButton = screen.queryByRole('button', {
      name: 'Add document',
    });
    expect(addDocumentButton).not.toBeInTheDocument();
  });

  it('enables the Add document button when have canCreate permission', () => {
    const mockedPermissionsContextValue = {
      permissions: {
        medical: {
          documents: {
            canView: true,
            canCreate: true,
          },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    };

    renderComponent(
      { showArchivedDocuments: false },
      mockedPermissionsContextValue
    );

    const addDocumentButton = screen.getByRole('button', {
      name: 'Add document',
    });
    expect(addDocumentButton).toBeInTheDocument();
    expect(addDocumentButton).toBeEnabled();
  });

  it('disables the Add document button when lacking permission', () => {
    const mockedPermissionsContextValue = {
      permissions: {
        medical: {
          documents: {
            canView: true,
            canCreate: false,
          },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    };

    renderComponent(
      { showArchivedDocuments: false },
      mockedPermissionsContextValue
    );

    const addDocumentButton = screen.getByRole('button', {
      name: 'Add document',
    });
    expect(addDocumentButton).toBeInTheDocument();
    expect(addDocumentButton).toBeDisabled();
  });

  describe('[feature-flag] export-multi-doc false', () => {
    beforeEach(() => {
      window.featureFlags['export-multi-doc'] = false;
    });

    it('does not render export button when FF is off', () => {
      const mockedPermissionsContextValue = {
        permissions: {
          medical: {
            documents: {
              canView: true,
              canCreate: false,
            },
            issues: {
              canExport: true,
            },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      };

      renderComponent(
        { showArchivedDocuments: false },
        mockedPermissionsContextValue
      );

      const exportButton = screen.queryByRole('button', {
        name: 'Export',
      });
      expect(exportButton).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] export-multi-doc true', () => {
    beforeEach(() => {
      window.featureFlags['export-multi-doc'] = true;
    });

    afterEach(() => {
      window.featureFlags['export-multi-doc'] = false;
    });

    it('does not render export button when showArchivedDocuments is true', () => {
      const mockedPermissionsContextValue = {
        permissions: {
          medical: {
            documents: {
              canView: true,
              canCreate: false,
            },
            issues: {
              canExport: true,
            },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      };

      renderComponent(
        { showArchivedDocuments: true },
        mockedPermissionsContextValue
      );

      const exportButton = screen.queryByRole('button', {
        name: 'Export',
      });
      expect(exportButton).not.toBeInTheDocument();
    });

    it('renders export button disabled when exportAttachments are empty', () => {
      const mockedPermissionsContextValue = {
        permissions: {
          medical: {
            documents: {
              canView: true,
              canCreate: false,
            },
            issues: {
              canExport: true,
            },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      };

      renderComponent(
        { showArchivedDocuments: false, exportAttachments: [] },
        mockedPermissionsContextValue
      );

      const exportButton = screen.getByRole('button', {
        name: 'Export',
      });
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toBeDisabled();
    });

    it('renders export button when showArchivedDocuments and permission is present and exportAttachments is non empty', async () => {
      const mockedPermissionsContextValue = {
        permissions: {
          medical: {
            documents: {
              canView: true,
              canCreate: false,
            },
            issues: {
              canExport: true,
            },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      };

      renderComponent(
        { showArchivedDocuments: false },
        mockedPermissionsContextValue
      );

      const exportButton = screen.getByRole('button', {
        name: 'Export',
      });
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toBeEnabled();

      await userEvent.click(exportButton);

      expect(props.onExportClick).toHaveBeenCalled();
    });
  });
});

describe('[feature-flag] pm-date-range-picker-custom', () => {
  afterEach(() => {
    window.getFlag = jest.fn(() => false);
  });

  it('renders default DateRangePicker when feature flag is OFF', () => {
    window.getFlag = jest.fn(() => false);

    renderComponent();

    const desktopFilters = within(
      screen.getByTestId('FilesFilters|DesktopFilters')
    );

    expect(desktopFilters.getAllByText('Date range').length).toBeGreaterThan(0);

    expect(
      screen.queryByText('MockCustomDateRangePicker')
    ).not.toBeInTheDocument();
  });

  it('renders CustomDateRangePicker when feature flag is ON', () => {
    window.getFlag = jest.fn(() => true);

    renderComponent();

    const desktopFilters = within(
      screen.getByTestId('FilesFilters|DesktopFilters')
    );

    expect(desktopFilters.queryByText('Date range')).not.toBeInTheDocument();

    expect(
      screen.getAllByText('MockCustomDateRangePicker').length
    ).toBeGreaterThan(0);
  });
});

describe('TRIAL ATHLETE - Add document button', () => {
  beforeEach(() => {
    window.featureFlags['medical-documents-files-area'] = true;
  });

  afterEach(() => {
    window.featureFlags['medical-documents-files-area'] = false;
  });

  it('does render by default', () => {
    renderComponent({ hiddenFilters: [], isAthleteOnTrial: true });

    expect(
      screen.getByRole('button', { name: 'Add document' })
    ).toBeInTheDocument();
  });

  it('does not render when hidden', () => {
    renderComponent({ hiddenFilters: [ADD_MEDICAL_FILE_BUTTON] });

    expect(
      screen.queryByRole('button', { name: 'Add document' })
    ).not.toBeInTheDocument();
  });

  it('does not render archive button', () => {
    renderComponent({
      hiddenFilters: [ADD_MEDICAL_FILE_BUTTON],
      isAthleteOnTrial: true,
    });

    expect(screen.queryByText('View Archive')).not.toBeInTheDocument();
  });

  it('renders archive button when not on Trial', () => {
    renderComponent({ hiddenFilters: [], isAthleteOnTrial: false });

    expect(screen.getByText('View Archive')).toBeInTheDocument();
  });
});

describe('TRIAL ATHLETE - Scan button', () => {
  beforeEach(() => {
    window.featureFlags['medical-mass-scanning'] = true;
  });

  afterEach(() => {
    window.featureFlags['medical-mass-scanning'] = false;
  });

  it('does render by default', () => {
    renderComponent({ hiddenFilters: [], isAthleteOnTrial: true });

    expect(screen.getByRole('button', { name: 'Scan' })).toBeInTheDocument();
  });

  it('does not render when atIssueLevel is true', () => {
    renderComponent({ hiddenFilters: [], atIssueLevel: true });

    expect(
      screen.queryByRole('button', { name: 'Scan' })
    ).not.toBeInTheDocument();
  });

  it('does not render when hidden', () => {
    renderComponent({ hiddenFilters: [SCAN_BUTTON], isAthleteOnTrial: true });

    expect(
      screen.queryByRole('button', { name: 'Scan' })
    ).not.toBeInTheDocument();
  });
});
