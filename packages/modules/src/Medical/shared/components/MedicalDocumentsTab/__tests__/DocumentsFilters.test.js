import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DocumentsFilters from '../DocumentsFilters';
import { playerOptions, categoryOptions } from './mocks/documentsFilterData';

jest.mock(
  '@kitman/playbook/components/wrappers/CustomDateRangePicker',
  () => () => <div>CustomDateRangePickerStub</div>
);

beforeEach(() => {
  // Clear mocks before each test to ensure clean state for prop assertions
  jest.clearAllMocks();
});

const props = {
  setIsPanelOpen: jest.fn(),
  playerOptions: [],
  categoryOptions: [],
  initialDataRequestStatus: null,
  selectedPlayer: null,
  setSelectedPlayer: jest.fn(),
  selectedDateRange: null,
  setSelectedDateRange: jest.fn(),
  searchContent: '',
  setSearchContent: jest.fn(),
  selectedCategories: [],
  setSelectedCategories: jest.fn(),
  showPlayerFilter: true,
  filters: {
    content: '',
    date_range: null,
    athlete_id: null,
    document_note_category_ids: [],
    organisation_annotation_type: ['OrganisationAnnotationTypes::Document'],
    unexpired: true,
    squads: [],
    organisation_annotation_type_ids: [],
    author: [],
    archived: false,
  },
  setFilters: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('TRIAL ATHLETE - Add document button', () => {
  const renderWithHiddenFilters = (hiddenFilters = []) => {
    render(<DocumentsFilters {...props} hiddenFilters={hiddenFilters} />);
  };

  it('does render by default', async () => {
    renderWithHiddenFilters([]);
    expect(
      screen.getByRole('button', { name: 'Add document' })
    ).toBeInTheDocument();
  });

  it('does not render when hidden', async () => {
    renderWithHiddenFilters(['add_document_button']);

    expect(
      screen.queryByRole('button', { name: 'Add document' })
    ).not.toBeInTheDocument();
  });
});

describe('<DocumentsFilters/>', () => {
  const defaultPermissions = DEFAULT_CONTEXT_VALUE.permissions.medical;

  it('renders desktop filters', () => {
    render(<DocumentsFilters {...props} />);
    expect(
      screen.getByRole('heading', { name: 'Documents' })
    ).toBeInTheDocument();

    const desktopFilters = screen.getByTestId(
      'DocumentsFilters|DesktopFilters'
    );
    expect(
      within(desktopFilters).getByPlaceholderText('Search Notes')
    ).toBeInTheDocument();

    expect(within(desktopFilters).getByText('Date range')).toBeInTheDocument();

    expect(within(desktopFilters).getByText('Player')).toBeInTheDocument();

    expect(within(desktopFilters).getByText('Categories')).toBeInTheDocument();
  });

  it('renders mobile filters', () => {
    render(<DocumentsFilters {...props} />);
    const mobileFilters = screen.getByTestId('DocumentsFilters|MobileFilters');
    expect(
      within(mobileFilters).getByPlaceholderText('Search Notes')
    ).toBeInTheDocument();

    expect(within(mobileFilters).getByText('Date range')).toBeInTheDocument();

    expect(within(mobileFilters).getByText('Player')).toBeInTheDocument();

    expect(within(mobileFilters).getByText('Categories')).toBeInTheDocument();
  });

  it('renders category options', async () => {
    render(<DocumentsFilters {...props} categoryOptions={categoryOptions} />);

    const desktopFilters = screen.getByTestId(
      'DocumentsFilters|DesktopFilters'
    );

    const selectElement = within(desktopFilters).getByText('Categories', {
      selector: '.kitmanReactSelect__placeholder',
    });

    await selectEvent.openMenu(selectElement);
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('renders player options', async () => {
    render(<DocumentsFilters {...props} playerOptions={playerOptions} />);

    const desktopFilters = screen.getByTestId(
      'DocumentsFilters|DesktopFilters'
    );

    const selectElement = within(desktopFilters).getByText('Player', {
      selector: '.kitmanReactSelect__placeholder',
    });

    await selectEvent.openMenu(selectElement);
    expect(screen.getByText('Athlete 1')).toBeInTheDocument();
    expect(screen.getByText('Athlete 2')).toBeInTheDocument();
  });

  it('Does not render player selector when showPlayerFilter is false', () => {
    render(<DocumentsFilters {...props} showPlayerFilter={false} />);

    const desktopFilters = screen.getByTestId(
      'DocumentsFilters|DesktopFilters'
    );
    expect(
      within(desktopFilters).queryByText('Player')
    ).not.toBeInTheDocument();

    const mobileFilters = screen.getByTestId('DocumentsFilters|MobileFilters');
    expect(within(mobileFilters).queryByText('Player')).not.toBeInTheDocument();
  });

  it('disables add button when insufficient permissions', async () => {
    const user = userEvent.setup();
    const mockedPermissionsContextValue = {
      permissions: {
        medical: {
          ...defaultPermissions,
          documents: {
            canView: true,
            canCreate: false,
          },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    };

    render(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <DocumentsFilters {...props} />
      </MockedPermissionContextProvider>
    );

    const button = screen.getByRole('button', { name: 'Add document' });
    await user.click(button);
    expect(props.setIsPanelOpen).not.toHaveBeenCalled();
  });
});

describe('[feature-flag] pm-date-range-picker-custom', () => {
  it('renders default DateRangePicker when feature flag is disabled', () => {
    window.setFlag('pm-date-range-picker-custom', false);
    render(<DocumentsFilters {...props} />);
    expect(
      screen.queryByText('CustomDateRangePickerStub')
    ).not.toBeInTheDocument();
    const labels = screen.getAllByText(/Date range/i);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('renders CustomDateRangePicker when feature flag is enabled', () => {
    window.setFlag('pm-date-range-picker-custom', true);
    render(<DocumentsFilters {...props} />);
    const stubs = screen.getAllByText('CustomDateRangePickerStub');
    expect(stubs.length).toBeGreaterThan(0);
  });
});
