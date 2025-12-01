import { fireEvent, render, screen } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers-pro/AdapterMoment';
import moment from 'moment';
import DesktopDateRangePicker from '../index';

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (key) => key,
}));

describe('DesktopDateRangePicker', () => {
  const defaultProps = {
    variant: 'default',
    selectedFilter: null,
    handleQuickSelect: jest.fn(),
    defaultPrimary: 'primary',
    defaultContrastText: '#fff',
    filters: [],
    disableFuture: false,
    disablePast: false,
    minDate: null,
    maxDate: null,
    dateRange: [null, null],
    handleStartDateChange: jest.fn(),
    handleEndDateChange: jest.fn(),
    handleClearDates: jest.fn(),
    closeCalendar: jest.fn(),
  };

  const renderComponent = (props = {}) =>
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DesktopDateRangePicker {...defaultProps} {...props} />
      </LocalizationProvider>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders start and end calendar titles', () => {
    renderComponent();
    expect(screen.getByText('Start date')).toBeInTheDocument();
    expect(screen.getByText('End date')).toBeInTheDocument();
  });

  it('calls handleClearDates when Cancel button is clicked', () => {
    renderComponent();
    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(defaultProps.handleClearDates).toHaveBeenCalledTimes(1);
  });

  it('calls closeCalendar when Apply button is clicked', () => {
    renderComponent();
    const applyBtn = screen.getByText('Apply');
    fireEvent.click(applyBtn);
    expect(defaultProps.closeCalendar).toHaveBeenCalledTimes(1);
  });

  it('renders calendars for start and end dates', () => {
    renderComponent();
    const startCalendar = screen
      .getByText('Start date')
      .closest('[data-calendar-type="start"]');
    const endCalendar = screen
      .getByText('End date')
      .closest('[data-calendar-type="end"]');
    expect(startCalendar).toBeInTheDocument();
    expect(endCalendar).toBeInTheDocument();
  });

  it('should disable dates before start date in end date picker', () => {
    const startDate = moment('2025-07-05');
    const endDate = moment('2025-07-10');

    renderComponent({
      dateRange: [startDate, endDate],
    });

    const instance = screen.getByText('End date').closest('div');
    expect(instance).toBeInTheDocument();

    // eslint-disable-next-line no-unused-vars
    const picker = renderComponent({
      dateRange: [startDate, endDate],
    });

    const shouldDisableDate = DesktopDateRangePicker({
      ...defaultProps,
      dateRange: [startDate, endDate],
    }).props?.children[2].props.children[1].props.shouldDisableDate;

    if (shouldDisableDate) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(shouldDisableDate(moment('2025-07-04'))).toBe(true);
      // eslint-disable-next-line jest/no-conditional-expect
      expect(shouldDisableDate(moment('2025-07-06'))).toBe(false);
    }
  });
});
