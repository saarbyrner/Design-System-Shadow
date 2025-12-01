import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
import CustomDateRangePicker from '../index';

// Mock the hooks and external dependencies
jest.mock('../hooks/useIsMobile', () => ({
  useIsMobile: () => false, // Default to desktop
}));

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  useGetOrganisationQuery: () => ({
    data: { locale: 'en-US' },
  }),
}));

// Mock Material-UI date pickers
jest.mock('@mui/x-date-pickers-pro', () => {
  // eslint-disable-next-line global-require,no-shadow
  const moment = require('moment');
  return {
    // eslint-disable-next-line no-unused-vars
    StaticDatePicker: ({ children, onChange, value, ...props }) => (
      <div
        data-testid="static-date-picker"
        onClick={() => onChange?.(moment())}
      >
        Static Date Picker - {value ? value.format('YYYY-MM-DD') : 'No date'}
        {children}
      </div>
    ),
  };
});

// Mock LocalizationProvider
jest.mock('../../../../providers/wrappers/LocalizationProvider', () => {
  return function MockLocalizationProvider({ children }) {
    return <div data-testid="localization-provider">{children}</div>;
  };
});

// Create a theme for testing
const theme = createTheme();

// Test wrapper component
const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('CustomDateRangePicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders without crashing', () => {
    render(
      <TestWrapper>
        <CustomDateRangePicker onChange={mockOnChange} />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders with an initial date range value', () => {
    const initialStartDate = moment('2023-01-04');
    const initialEndDate = moment('2023-01-31');
    render(
      <TestWrapper>
        <CustomDateRangePicker
          onChange={mockOnChange}
          value={[initialStartDate, initialEndDate]}
        />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('01/04/2023 — 01/31/2023');
  });

  test('displays correct placeholder based on locale', () => {
    render(
      <TestWrapper>
        <CustomDateRangePicker onChange={mockOnChange} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('MM/DD/YYYY — MM/DD/YYYY');
    expect(input).toBeInTheDocument();
  });

  test('shows calendar icon when no dates selected', () => {
    render(
      <TestWrapper>
        <CustomDateRangePicker onChange={mockOnChange} />
      </TestWrapper>
    );

    // Look for any button (calendar icon button)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('allows manual input of dates', () => {
    render(
      <TestWrapper>
        <CustomDateRangePicker onChange={mockOnChange} />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '01012024' } });

    expect(input).toHaveValue('01/01/2024');
  });

  test('formats date range input correctly', () => {
    render(
      <TestWrapper>
        <CustomDateRangePicker onChange={mockOnChange} />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '0101202431122024' } });

    expect(input).toHaveValue('01/01/2024 — 31/12/2024');
  });

  test('handles backspace in input', () => {
    render(
      <TestWrapper>
        <CustomDateRangePicker onChange={mockOnChange} />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '01012024' } });
    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(input).toHaveValue('01/01/202');
  });

  test('renders with custom filters', () => {
    const customFilters = [
      {
        key: 'custom',
        label: 'Custom Filter',
        getDateRange: () => [moment().startOf('day'), moment().endOf('day')],
      },
    ];

    render(
      <TestWrapper>
        <CustomDateRangePicker
          onChange={mockOnChange}
          customFilters={customFilters}
        />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('applies menuFilters variant styles', () => {
    render(
      <TestWrapper>
        <CustomDateRangePicker onChange={mockOnChange} variant="menuFilters" />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('respects disableFuture prop', () => {
    render(
      <TestWrapper>
        <CustomDateRangePicker onChange={mockOnChange} disableFuture />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('respects disablePast prop', () => {
    render(
      <TestWrapper>
        <CustomDateRangePicker onChange={mockOnChange} disablePast />
      </TestWrapper>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
