// Unit Test for SearchBar Component
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../searchBar';

describe('SearchBar Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    render(
      <SearchBar placeholder="Search..." onChange={mockOnChange} value="" />
    );
  });

  it('renders with the correct placeholder', () => {
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders with the correct input type', () => {
    render(
      <SearchBar
        placeholder="Search"
        value=""
        onChange={() => {}}
        inputType="number"
      />
    );
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('renders with default input type as text', () => {
    render(<SearchBar placeholder="Search" value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('calls onChange when input value changes', () => {
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'Test' } });
    expect(mockOnChange).toHaveBeenCalledWith('Test');
  });

  it('displays the correct value', () => {
    render(
      <SearchBar placeholder="Search..." onChange={mockOnChange} value="Test" />
    );
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
  });
});
