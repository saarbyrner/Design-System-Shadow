import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import {
  authors,
  defaultFilters,
  squadAthletes,
  squads,
} from './mocks/ModificationsFilters';

import ModificationsFilters from '../ModificationsFilters';

jest.mock(
  '@kitman/playbook/components/wrappers/CustomDateRangePicker',
  () => () => <div>CustomDateRangePickerStub</div>
);

const renderWithProviders = (component, permissionsOverrides = {}) => {
  const updatedPermissions = {
    ...DEFAULT_CONTEXT_VALUE.permissions,
    medical: {
      ...DEFAULT_CONTEXT_VALUE.permissions.medical,
      modifications: {
        ...DEFAULT_CONTEXT_VALUE.permissions.medical.modifications,
        ...permissionsOverrides,
      },
    },
  };

  return render(
    <PermissionsContext.Provider
      value={{
        permissions: updatedPermissions,
        permissionsRequestStatus: 'SUCCESS',
      }}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {component}
      </LocalizationProvider>
    </PermissionsContext.Provider>
  );
};

const props = {
  filters: defaultFilters,
  hiddenFilters: [],
  onChangeFilter: jest.fn(),
  showPlayerFilter: true,
  onClickAddModification: jest.fn(),
  squads,
  authors,
  squadAthletes,
  initialDataRequestStatus: 'SUCCESS',
  t: i18nextTranslateStub(),
};

describe('<ModificationsFilters/>', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  it('renders component', async () => {
    renderWithProviders(<ModificationsFilters {...props} />);
    expect(screen.getByText(/Modifications/i)).toBeInTheDocument();

    const searchFilters = screen.getAllByPlaceholderText(/Search/i);
    const rosterFilters = screen.getAllByText(/Roster/i);
    const authorFilters = screen.getAllByText(/Author/i);
    const playerFilters = screen.getAllByText(/Player/i);
    const datePickers = screen.getAllByPlaceholderText('MM/DD/YYYY');

    // We have two filter of each - One for Web another for mobile.
    expect(searchFilters).toHaveLength(2);
    expect(rosterFilters).toHaveLength(2);
    expect(authorFilters).toHaveLength(2);
    expect(playerFilters).toHaveLength(2);
    expect(datePickers).toHaveLength(4);
  });

  it('renders the filters correctly when the player filter is shown', () => {
    renderWithProviders(<ModificationsFilters {...props} showPlayerFilter />);

    const searchFilters = screen.getAllByPlaceholderText(/Search/i);
    const rosterFilters = screen.getAllByText(/Roster/i);
    const authorFilters = screen.getAllByText(/Author/i);
    const playerFilters = screen.getAllByText(/Player/i);

    // We have two filter of each - One for Web another for mobile.
    // When player filter is shown, there should be 4 filter sections (Search, Roster, Author, Player)
    // Each appearing twice (web and mobile)
    expect(searchFilters).toHaveLength(2);
    expect(rosterFilters).toHaveLength(2);
    expect(authorFilters).toHaveLength(2);
    expect(playerFilters).toHaveLength(2);
  });

  it('renders the filters in a side panel when on mobile', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModificationsFilters {...props} />);

    // The side panel is closed by default (check for the mobile filter button)
    const mobileFilterButton = screen.getAllByRole('button', {
      name: 'Filters',
    })[0]; // Assuming the first one is the mobile trigger
    expect(mobileFilterButton).toBeInTheDocument();

    // The side panel is closed by default, so the panel content should not be visible
    expect(screen.queryByText('Apply Filters')).not.toBeInTheDocument();

    await user.click(mobileFilterButton);

    // The side panel is open after clicking the filter option
    const mobileFiltersPanel = screen.getByTestId('sliding-panel');
    expect(
      within(mobileFiltersPanel).getByPlaceholderText(/Search/i)
    ).toBeInTheDocument();
    expect(within(mobileFiltersPanel).getByText(/Roster/i)).toBeInTheDocument();
    expect(within(mobileFiltersPanel).getByText(/Author/i)).toBeInTheDocument();
    expect(within(mobileFiltersPanel).getByText(/Player/i)).toBeInTheDocument();
  });

  it('hides the squad filters when defined in hiddenFilters prop', () => {
    renderWithProviders(
      <ModificationsFilters {...props} hiddenFilters={['squads']} />
    );

    // Check that 'Roster' filter is not present
    expect(screen.queryByText(/Roster/i)).not.toBeInTheDocument();

    // Check that other filters are still present
    expect(screen.getAllByPlaceholderText(/Search/i)).toHaveLength(2);
    expect(screen.getAllByText(/Author/i)).toHaveLength(2);
  });

  it('calls the correct function when typing in search', () => {
    renderWithProviders(<ModificationsFilters {...props} />);

    const searchInput = screen.getAllByPlaceholderText(/Search/i)[0]; // Get the first search input
    fireEvent.change(searchInput, { target: { value: 'search text' } });

    expect(props.onChangeFilter).toHaveBeenCalledWith({
      ...defaultFilters,
      content: 'search text',
    });
  });

  it('calls the correct function when selecting a squad', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModificationsFilters {...props} />);

    const squadSelect = screen.getAllByText(/Roster/i)[0];
    await user.click(squadSelect); // Open the select menu
    await user.click(screen.getByText('Squad 1')); // Click the option

    expect(props.onChangeFilter).toHaveBeenCalledWith({
      ...defaultFilters,
      squads: [1],
    });
  });

  it('calls the correct function when selecting an author', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModificationsFilters {...props} />);

    const authorSelect = screen.getAllByText(/Author/i)[0];
    await user.click(authorSelect); // Open the select menu
    await user.click(screen.getByText('Author 1')); // Click the option

    expect(props.onChangeFilter).toHaveBeenCalledWith({
      ...defaultFilters,
      author: [1],
    });
  });

  it('calls the correct function when selecting a player', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModificationsFilters {...props} showPlayerFilter />);

    const playerSelect = screen.getAllByText(/Player/i)[0];
    await user.click(playerSelect); // Open the select menu
    await user.click(screen.getByText('Player 1')); // Click the option

    expect(props.onChangeFilter).toHaveBeenCalledWith({
      ...defaultFilters,
      athlete_id: 1,
    });
  });
});

describe('TRIAL ATHLETE - Add button', () => {
  it('does render by default', async () => {
    renderWithProviders(
      <ModificationsFilters {...props} hiddenFilters={[]} />,
      { canCreate: true }
    );
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });
  it('does not render when hidden', async () => {
    renderWithProviders(
      <ModificationsFilters
        {...props}
        hiddenFilters={['add_modification_button']}
      />,
      { canCreate: true }
    );

    expect(
      screen.queryByRole('button', { name: 'Add' })
    ).not.toBeInTheDocument();
  });

  it('calls the correct function when clicking the add modification action', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModificationsFilters {...props} showPlayerFilter />, {
      canCreate: true,
    });

    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.click(addButton);
    const tooltipMenuList = screen.getByTestId('TooltipMenu|PrimaryListItem');
    await user.click(within(tooltipMenuList).getByRole('button'));

    expect(props.onClickAddModification).toHaveBeenCalledTimes(1);
  });
});

// Feature-flag tests for custom date picker
describe('[feature-flag] pm-date-range-picker-custom', () => {
  it('renders default DateRangePicker when feature flag is disabled', () => {
    renderWithProviders(<ModificationsFilters {...props} />);
    // There should be 4 default date inputs (2 pickers × 2 inputs)
    const datePickers = screen.getAllByPlaceholderText('MM/DD/YYYY');
    expect(datePickers).toHaveLength(4);
    // Custom picker stub should not render
    expect(
      screen.queryByText('CustomDateRangePickerStub')
    ).not.toBeInTheDocument();
  });

  it('renders CustomDateRangePicker when feature flag is enabled', () => {
    window.setFlag('pm-date-range-picker-custom', true);
    renderWithProviders(<ModificationsFilters {...props} />);
    const stubs = screen.getAllByText('CustomDateRangePickerStub');
    expect(stubs).toHaveLength(2);
  });
});
