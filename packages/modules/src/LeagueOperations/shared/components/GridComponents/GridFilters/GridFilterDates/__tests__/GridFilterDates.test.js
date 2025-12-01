import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers-pro/AdapterMoment';

import GridFilterDates from '..';

describe('GridFilterDates', () => {
  const user = userEvent.setup();
  const defaultProps = {
    label: 'Test Date',
    param: 'start_date',
    permissionGroup: 'staff',
    defaultValue: null,
    value: null,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-08-01T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  function setupTest() {
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <GridFilterDates {...defaultProps} open />
      </LocalizationProvider>
    );
  }

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-08-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with initial value and triggers onChange on date select', async () => {
    setupTest();

    const dateButton = screen.getByLabelText(/choose date/i);
    user.click(dateButton);

    // The calendar will now be showing August 2025 because of the fake timer.
    const dayButton = await screen.findByRole('gridcell', { name: '15' });
    user.click(dayButton);

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        '2025-08-15T00:00:00+00:00'
      );
    });

    const dateInput = screen.getByRole('textbox', { name: /date/i });
    expect(dateInput).toHaveValue('08/15/2025');
  });

  it('ref.getParam() returns the param', () => {
    const mockRef = {
      current: { getParam: jest.fn().mockReturnValue('start_date') },
    };
    expect(mockRef.current.getParam()).toBe('start_date');
  });

  it('ref.getResetValue() returns the defaultValue', () => {
    const mockRef = {
      current: { getResetValue: jest.fn().mockReturnValue(null) },
    };
    expect(mockRef.current.getResetValue()).toBe(null);
  });
});
