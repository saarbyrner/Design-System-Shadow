import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../index';

jest.mock('../GroupMenu', () =>
  jest.fn(() => <div data-testid="group-menu" />)
);

jest.useFakeTimers();

describe('<SearchBar />', () => {
  let onSearchChange;

  beforeEach(() => {
    onSearchChange = jest.fn();
  });

  const renderComponent = (props = {}) =>
    render(
      <SearchBar onSearchChange={onSearchChange} isLoading={false} {...props} />
    );

  it('renders the search input', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search');
    expect(input).toBeInTheDocument();
  });

  it('calls onSearchChange with debounced input', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'Alice' } });

    jest.advanceTimersByTime(600);

    await waitFor(() => {
      expect(onSearchChange).toHaveBeenCalledWith('Alice');
    });
  });

  it('disables the input when isLoading is true', () => {
    renderComponent({ isLoading: true });
    const input = screen.getByPlaceholderText('Search');
    expect(input).toBeDisabled();
  });
});
