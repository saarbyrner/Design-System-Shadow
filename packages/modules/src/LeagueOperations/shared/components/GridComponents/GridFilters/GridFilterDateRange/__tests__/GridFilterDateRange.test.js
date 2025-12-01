import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers-pro/AdapterMoment';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import GridFilterDateRange from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

describe('GridFilterDateRange', () => {
  const defaultProps = {
    label: 'Date range',
    param: 'date_range',
    defaultValue: { start_date: '2025-05-10', end_date: '2025-11-24' },
    value: { start_date: '2025-05-10', end_date: '2025-11-24' },
    onChange: jest.fn(),
  };

  function setupTest(localProps = {}, ref = null) {
    const props = {
      ...defaultProps,
      ...localProps,
    };
    return render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <GridFilterDateRange {...props} ref={ref} />
      </LocalizationProvider>
    );
  }

  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Man United',
        association_name: 'Premier League',
      },
    });
  });

  it('renders with initial value and triggers the onChange function when a date is selected', async () => {
    const user = userEvent.setup();
    setupTest();

    const dateRangeInput = screen.getByLabelText(/Date range/i);
    expect(dateRangeInput).toBeInTheDocument();
    expect(dateRangeInput).toHaveValue('May 10, 2025 - Nov 24, 2025');
    await user.click(dateRangeInput);

    const may31Button = await screen.findByRole('gridcell', { name: '31' });
    expect(may31Button).toBeInTheDocument();
    await user.click(may31Button);

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        end_date: '2025-11-24',
        start_date: '2025-05-31',
      });
    });
    expect(dateRangeInput).toHaveValue('May 31, 2025 - Nov 24, 2025');
  });

  it('getParam returns the param', () => {
    const mockRef = {
      current: { getParam: jest.fn().mockReturnValue('date_range') },
    };
    expect(mockRef.current.getParam()).toBe('date_range');
  });

  it('getResetValue returns the defaultValue', () => {
    const mockRef = {
      current: {
        getResetValue: jest.fn().mockReturnValue(defaultProps.defaultValue),
      },
    };
    expect(mockRef.current.getResetValue()).toBe(defaultProps.defaultValue);
  });

  it('getIsFilterApplied returns true', () => {
    const mockRef = {
      current: {
        getResetValue: jest.fn().mockReturnValue(defaultProps.defaultValue),
      },
    };
    expect(mockRef.current.getResetValue()).toBe(defaultProps.defaultValue);
  });

  it('getIsFilterApplied returns true when value is set', () => {
    const ref = React.createRef();
    setupTest(null, ref);
    expect(ref.current.getIsFilterApplied()).toBe(true);
  });

  it('getIsFilterApplied returns false when value is not set', () => {
    const ref = React.createRef();
    setupTest({ value: { start_date: null, end_date: null } }, ref);
    expect(ref.current.getIsFilterApplied()).toBe(false);
  });
});
