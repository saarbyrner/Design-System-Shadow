import userEvent from '@testing-library/user-event';
import { screen, render } from '@testing-library/react';

import SearchableSelect from '../SearchableSelect/SearchableSelect';

const mockClubs = [
  { id: 1, name: 'KL Galaxy' },
  { id: 2, name: 'KL Toronto' },
  { id: 3, name: 'KL Dallas' },
];

const mockStatuses = ['Active', 'Pending', 'Suspended'];

// mock hook to simulate different API states
const mockUseQueryHook = jest.fn();

const mockRequestStatus = {
  isFetching: false,
  isLoading: false,
  isError: false,
};

describe('SearchableSelect', () => {
  let searchQueryMock;

  // Reset mocks before each test to ensure isolation
  beforeEach(() => {
    searchQueryMock = jest.fn();
    mockUseQueryHook.mockClear();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      label: 'Club',
      useQueryHook: mockUseQueryHook,
      queryHookArgs: 'org-123',
      getOptionLabel: (option) => option.name,
      getOptionValue: (option) => option.id,
      searchQuery: searchQueryMock,
      requestStatus: mockRequestStatus,
    };

    return render(<SearchableSelect {...defaultProps} {...props} />);
  };

  it('should render the label and be disabled while loading', () => {
    mockUseQueryHook.mockReturnValue({ data: [], isLoading: true });

    renderComponent();

    const input = screen.getByLabelText('Club');
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  it('should be disabled when requestStatus.isFetching is true', () => {
    mockUseQueryHook.mockReturnValue({ data: mockClubs, isLoading: false });

    renderComponent({
      requestStatus: { ...mockRequestStatus, isFetching: true },
    });

    const input = screen.getByLabelText('Club');
    expect(input).toBeDisabled();
  });

  it('should call searchQuery with the selected value when an option is chosen', async () => {
    const user = userEvent.setup();
    mockUseQueryHook.mockReturnValue({ data: mockClubs, isLoading: false });

    renderComponent();

    const input = screen.getByLabelText('Club');
    expect(input).toBeEnabled();

    // Simulate user interaction
    await user.click(input);

    // select an option
    await user.click(screen.getByText('KL Toronto'));

    // Assertions
    expect(searchQueryMock).toHaveBeenCalledTimes(1);
    expect(searchQueryMock).toHaveBeenCalledWith(2);

    // Check if the input now displays the selected value's label
    expect(input).toHaveValue('KL Toronto');
  });

  it('should call searchQuery with the value wrapped in an array', async () => {
    const user = userEvent.setup();
    mockUseQueryHook.mockReturnValue({ data: mockClubs, isLoading: false });

    renderComponent({ wrapQueryValueInArray: true });

    const input = screen.getByLabelText('Club');
    await user.click(input);

    await user.click(screen.getByText('KL Dallas'));

    expect(searchQueryMock).toHaveBeenCalledTimes(1);
    expect(searchQueryMock).toHaveBeenCalledWith([3]);
    expect(input).toHaveValue('KL Dallas');
  });

  it('should call searchQuery with null when the selection is cleared', async () => {
    const user = userEvent.setup();
    mockUseQueryHook.mockReturnValue({ data: mockClubs, isLoading: false });

    renderComponent();

    const input = screen.getByLabelText('Club');

    await user.click(input);
    await user.click(screen.getByText('KL Galaxy'));

    expect(searchQueryMock).toHaveBeenCalledWith(1);
    expect(input).toHaveValue('KL Galaxy');

    // Now, clear the value using the clear button
    const clearButton = screen.getByLabelText('Clear');

    await user.click(clearButton);

    expect(searchQueryMock).toHaveBeenCalledTimes(2);
    expect(searchQueryMock).toHaveBeenLastCalledWith(null);

    // The input should be empty
    expect(input).toHaveValue('');
  });

  // Test Case 6: Clearing with wrapQueryValueInArray
  it('should call searchQuery with an empty array when cleared and wrapQueryValueInArray is true', async () => {
    const user = userEvent.setup();
    mockUseQueryHook.mockReturnValue({ data: mockClubs, isLoading: false });

    renderComponent({ wrapQueryValueInArray: true });

    const input = screen.getByLabelText('Club');

    await user.click(input);
    await user.click(screen.getByText('KL Galaxy'));

    expect(searchQueryMock).toHaveBeenCalledWith([1]);

    const clearButton = screen.getByLabelText('Clear');
    await user.click(clearButton);

    expect(searchQueryMock).toHaveBeenLastCalledWith([]);
    expect(input).toHaveValue('');
  });

  it('should handle string array options correctly', async () => {
    const user = userEvent.setup();
    mockUseQueryHook.mockReturnValue({ data: mockStatuses, isLoading: false });

    renderComponent({
      label: 'Status',
      getOptionLabel: (option) => option,
      getOptionValue: (option) => option,
    });

    const input = screen.getByLabelText('Status');
    await user.click(input);

    await user.click(screen.getByText('Suspended'));

    expect(searchQueryMock).toHaveBeenCalledTimes(1);
    expect(searchQueryMock).toHaveBeenCalledWith('Suspended');
    expect(input).toHaveValue('Suspended');
  });
});
