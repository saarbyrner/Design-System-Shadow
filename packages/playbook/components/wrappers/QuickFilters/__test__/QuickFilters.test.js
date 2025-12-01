import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
import QuickFilters from '../index';

// Mock the colors
jest.mock('@kitman/common/src/variables', () => ({
  colors: {
    grey_300: '#9CA3AF',
    white: '#FFFFFF',
  },
}));

// Create a theme for testing
const theme = createTheme();

// Test wrapper component
const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('QuickFilters', () => {
  const mockOnQuickSelect = jest.fn();
  const mockFilters = [
    {
      key: 'week',
      label: 'This Week',
      getDateRange: () => [moment().startOf('week'), moment().endOf('week')],
    },
    {
      key: 'month',
      label: 'This Month',
      getDateRange: () => [moment().startOf('month'), moment().endOf('month')],
    },
    {
      key: 'year',
      label: 'This Year',
      getDateRange: () => [moment().startOf('year'), moment().endOf('year')],
    },
  ];

  beforeEach(() => {
    mockOnQuickSelect.mockClear();
  });

  test('renders without crashing', () => {
    render(
      <TestWrapper>
        <QuickFilters
          selectedFilter={null}
          onQuickSelect={mockOnQuickSelect}
          defaultPrimary="#000"
          defaultContrastText="#fff"
          filters={mockFilters}
        />
      </TestWrapper>
    );

    expect(screen.getByText('This Week')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText('This Year')).toBeInTheDocument();
  });

  test('renders all provided filters', () => {
    render(
      <TestWrapper>
        <QuickFilters
          selectedFilter={null}
          onQuickSelect={mockOnQuickSelect}
          defaultPrimary="#000"
          defaultContrastText="#fff"
          filters={mockFilters}
        />
      </TestWrapper>
    );

    mockFilters.forEach((filter) => {
      expect(screen.getByText(filter.label)).toBeInTheDocument();
    });
  });

  test('calls onQuickSelect when filter is clicked', () => {
    render(
      <TestWrapper>
        <QuickFilters
          selectedFilter={null}
          onQuickSelect={mockOnQuickSelect}
          defaultPrimary="#000"
          defaultContrastText="#fff"
          filters={mockFilters}
        />
      </TestWrapper>
    );

    const weekFilter = screen.getByText('This Week');
    fireEvent.click(weekFilter);

    expect(mockOnQuickSelect).toHaveBeenCalledWith('week');
  });

  test('highlights selected filter', () => {
    render(
      <TestWrapper>
        <QuickFilters
          selectedFilter="month"
          onQuickSelect={mockOnQuickSelect}
          defaultPrimary="#000"
          defaultContrastText="#fff"
          filters={mockFilters}
        />
      </TestWrapper>
    );

    const monthFilter = screen.getByText('This Month');
    expect(monthFilter).toBeInTheDocument();
  });

  test('renders with empty filters array', () => {
    render(
      <TestWrapper>
        <QuickFilters
          selectedFilter={null}
          onQuickSelect={mockOnQuickSelect}
          defaultPrimary="#000"
          defaultContrastText="#fff"
          filters={[]}
        />
      </TestWrapper>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('handles multiple filter clicks', () => {
    render(
      <TestWrapper>
        <QuickFilters
          selectedFilter={null}
          onQuickSelect={mockOnQuickSelect}
          defaultPrimary="#000"
          defaultContrastText="#fff"
          filters={mockFilters}
        />
      </TestWrapper>
    );

    const weekFilter = screen.getByText('This Week');
    const monthFilter = screen.getByText('This Month');

    fireEvent.click(weekFilter);
    fireEvent.click(monthFilter);

    expect(mockOnQuickSelect).toHaveBeenCalledTimes(2);
    expect(mockOnQuickSelect).toHaveBeenNthCalledWith(1, 'week');
    expect(mockOnQuickSelect).toHaveBeenNthCalledWith(2, 'month');
  });
});
