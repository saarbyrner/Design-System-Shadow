import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { useGetAthleteDataQuery, useGetAncillaryEligibleRangesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { ThemeProvider } from '@kitman/playbook/providers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { rootTheme } from '@kitman/playbook/themes';
import { getDatePickerTheme } from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';

import MovementAwareDatePicker from '../index';

// Mock the useGetAthleteDataQuery hook
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
    useGetAncillaryEligibleRangesQuery: jest.fn(),
  })
);

// Mock the moment library
jest.mock('moment', () => jest.requireActual('moment'));

const defaultProps = {
  athleteId: 1,
  providedDateRanges: [{ start: '2024-01-01', end: '2024-01-11' }],
  kitmanDesignSystem: true,
  onChange: jest.fn(),
};

const renderComponent = (props = defaultProps) => ({
  user: userEvent.setup({ advanceTimers: jest.advanceTimersByTime }),
  // Render MovementAwareDatePicker component with Moment adapter
  ...render(
    <ThemeProvider theme={getDatePickerTheme()}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <MovementAwareDatePicker {...props} />
      </LocalizationProvider>
    </ThemeProvider>
  ),
});

const getOpenCalendarButton = () => {
  return screen.getByLabelText('Choose date');
};

const getInputField = () => {
  return screen.getByPlaceholderText('DD/MM/YYYY');
};

const getFieldSet = (inputField) => {
  return inputField.parentNode.querySelector('fieldset');
};

function checkDatesInRangeAreEnabled(range, allDatesInMonth) {
  const startIdx = range.start - 1;
  const endIdx = range.end;

  for (let i = startIdx; i < endIdx; i++) {
    expect(allDatesInMonth[i]).toBeEnabled();
  }
}

function checkDatesInRangeAreDisabled(range, allDatesInMonth) {
  const startIdx = range.start - 1;
  const endIdx = range.end;

  for (let i = startIdx; i < endIdx; i++) {
    expect(allDatesInMonth[i]).toHaveAttribute('disabled');
    expect(allDatesInMonth[i]).toBeDisabled();
  }
}

describe('MovementAwareDatePicker - using passed date ranges via props', () => {
  beforeEach(() => {
    const fakeDate = new Date('2024-01-31T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);

    // Mock the useGetAthleteDataQuery response - props wll take precedence over this response
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [{ start: '2024-01-13', end: '2024-01-28' }],
        },
      },
    });

    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: {
        eligible_ranges: [],
      },
    });
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', async () => {
    renderComponent();

    const inputField = getInputField();
    const openCalendarButton = getOpenCalendarButton();

    expect(inputField).toBeInTheDocument();
    expect(openCalendarButton).toBeInTheDocument();
  });

  it('renders the inputLabel when value passed', async () => {
    renderComponent({ inputLabel: 'my lovely label' });

    const inputLabel = screen.getByText('my lovely label');

    expect(inputLabel).toBeInTheDocument();
  });

  it('correctly applies MUI theme styles', async () => {
    const { user } = renderComponent();

    const inputWrapper = getInputField().parentNode;

    // verify that the custom theme is applied to the date field
    expect(inputWrapper).toHaveStyle({
      height: '2em',
      width: '18em',
    });

    // verify that the custom theme is applied to the date popper
    const openCalendarButton = screen.getByLabelText('Choose date');
    await user.click(openCalendarButton);
    const popper = document.querySelector(
      '[role="dialog"].MuiPickersPopper-root'
    );
    expect(popper).toBeInTheDocument();
    expect(popper).toHaveStyle({
      zIndex: '2147483007',
    });
  });

  it('uses kitman invalid styles when isInvalid and kitmanDesignSystem = true', async () => {
    renderComponent({
      athleteId: 1,
      isInvalid: true,
      kitmanDesignSystem: true,
    });

    const inputField = getInputField();

    expect(getFieldSet(inputField)).toHaveStyle({
      border: `2px solid ${rootTheme.palette.error.light}`,
    });
  });

  it('uses MUI invalid styles when isInvalid = true and kitmanDesignSystem = false', async () => {
    renderComponent({ athleteId: 1, isInvalid: true });

    const inputField = getInputField();

    expect(getFieldSet(inputField)).toHaveStyle({
      border: `2px groove threedface`,
    });
  });

  it('does not set input field as invalid if isInvalid prop is undefined', async () => {
    renderComponent({ athleteId: 1 });

    const inputField = getInputField();

    expect(getFieldSet(inputField)).not.toHaveStyle({
      border: `2px solid ${rootTheme.palette.error.light}`,
    });
  });

  it('displays input field as valid when isInvalid prop is false', async () => {
    renderComponent({ athleteId: 1 });

    const inputField = getInputField();

    expect(getFieldSet(inputField)).not.toHaveStyle({
      border: `2px solid ${rootTheme.palette.error.light}`,
    });
  });

  it('toggles (opens and closes) calendar view when button clicked', async () => {
    let allDatesInMonth;

    const { user } = renderComponent();

    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);

    const calendar = screen.getByRole('grid');
    allDatesInMonth = calendar.querySelectorAll('button[role="gridcell"]');

    expect(screen.getByText('January 2024')).toBeInTheDocument();
    expect(allDatesInMonth).toHaveLength(35);

    // close calendar view
    await user.click(openCalendarButton);
    const calendarGone = screen.queryByRole('grid');
    expect(calendarGone).not.toBeInTheDocument();
    allDatesInMonth = calendarGone?.querySelectorAll('button[role="gridcell"]');

    expect(screen.queryByText('January 2024')).not.toBeInTheDocument();
    expect(allDatesInMonth).toBe(undefined); // no numbered date elements to count if no calendar popper
  });

  it('toggles (opens and closes) calendar view when the input field is clicked', async () => {
    let allDatesInMonth;

    const { user } = renderComponent();

    const inputField = getInputField();

    // open calendar view
    await user.click(inputField);
    const calendar = screen.getByRole('grid');
    allDatesInMonth = calendar.querySelectorAll('button[role="gridcell"]');

    expect(screen.getByText('January 2024')).toBeInTheDocument();
    expect(allDatesInMonth).toHaveLength(35);

    // close calendar view
    await user.click(inputField);
    const calendarGone = screen.queryByRole('grid');
    expect(calendarGone).not.toBeInTheDocument();
    allDatesInMonth = calendarGone?.querySelectorAll('button[role="gridcell"]');

    expect(screen.queryByText('January 2024')).not.toBeInTheDocument();
    expect(allDatesInMonth).toBe(undefined); // no numbered date elements to count if no calendar popper
  });

  it('enables the correct dates', async () => {
    const { user } = renderComponent();

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);
    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    // first 11 date buttons should be the only dates enabled
    checkDatesInRangeAreEnabled({ start: 1, end: 11 }, allDatesInMonth);

    checkDatesInRangeAreDisabled(
      { start: 12, end: allDatesInMonth.length },
      allDatesInMonth
    );
  });

  it('does not enable future dates when disableFuture is true', async () => {
    const { user } = renderComponent({
      providedDateRanges: [{ start: '2024-01-01', end: '2024-01-11' }],
      disableFuture: true,
    });

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);
    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    // Range 1 1st - 11th
    // First 11 date buttons should be enabled
    checkDatesInRangeAreEnabled({ start: 1, end: 11 }, allDatesInMonth);

    // Dates outside of specified range should not be enabled
    checkDatesInRangeAreDisabled({ start: 12, end: 31 }, allDatesInMonth);
  });

  it('disables future dates when disableFuture is true', async () => {
    const fakeDate = new Date('2024-01-10T18:00:00Z'); // UTC FORMAT. Date within Range
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);

    const { user } = renderComponent({
      providedDateRanges: [{ start: '2024-01-01', end: '2024-01-11' }],
      disableFuture: true,
    });

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    await user.click(openCalendarButton);
    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    checkDatesInRangeAreEnabled({ start: 1, end: 10 }, allDatesInMonth);

    checkDatesInRangeAreDisabled({ start: 11, end: 31 }, allDatesInMonth);
    jest.useRealTimers();
  });

  it('enables the correct dates when start date is null', async () => {
    const { user } = renderComponent({
      providedDateRanges: [{ start: null, end: '2024-02-07' }],
    });

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // check January dates are enabled
    const calendar = screen.getByRole('grid');
    const allDatesInJanuary = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    checkDatesInRangeAreEnabled({ start: 1, end: 31 }, allDatesInJanuary);

    // check current month is January and then navigate to December
    expect(screen.queryByText('December 2023')).not.toBeInTheDocument();
    const previousMonthButton = screen.getByTitle('Previous month');
    expect(screen.getByText('January 2024')).toBeInTheDocument();

    await user.click(previousMonthButton);
    expect(screen.queryByText('December 2023')).toBeInTheDocument();

    // check current month is now December and all dates are enabled
    const calendar2 = screen.getByRole('grid');
    const allDatesInDecember = calendar2.querySelectorAll(
      'button[role="gridcell"]'
    );
    expect(screen.queryByText('January 2024')).not.toBeInTheDocument();

    expect(screen.getByText('December 2023')).toBeInTheDocument();
    checkDatesInRangeAreEnabled({ start: 1, end: 31 }, allDatesInDecember);

    jest.useRealTimers();
  });

  it('enables the correct dates when end date is null and disableFuture is true', async () => {
    const fakeDate = new Date('2024-01-10T18:00:00Z'); // UTC FORMAT. Date within Range
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);

    // null end date to default to current date that disableFuture is true
    const { user } = renderComponent({
      providedDateRanges: [{ start: '2024-01-01', end: null }],
      disableFuture: true,
    });

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // check correct January dates are enabled
    const calendar = screen.getByRole('grid');
    const allDatesInJanuary = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    checkDatesInRangeAreEnabled({ start: 1, end: 10 }, allDatesInJanuary);

    // check days in the future are disabled and next month button is disabled
    checkDatesInRangeAreDisabled({ start: 11, end: 31 }, allDatesInJanuary);
    const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
    expect(nextMonthButton).toBeDisabled();

    jest.useRealTimers();
  });

  it('enables the correct dates when no providedDateRanges or athleteId passed and disableFuture is true', async () => {
    const { user } = renderComponent({ disableFuture: true });

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // check correct January dates are enabled
    const calendar = screen.getByRole('grid');
    const allDatesInJanuary = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    checkDatesInRangeAreEnabled({ start: 1, end: 31 }, allDatesInJanuary);

    // check next month button is disabled
    const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
    expect(nextMonthButton).toBeDisabled();
  });

  it('enables the correct dates when multiple date ranges passed', async () => {
    const { user } = renderComponent({
      athleteId: 1,
      providedDateRanges: [
        { start: '2024-01-01', end: '2024-01-11' },
        { start: '2024-01-15', end: '2024-01-21' },
        { start: '2024-01-25', end: '2024-01-29' },
      ],
    });

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);
    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    // range 1 1st - 11th
    // first 11 date buttons should be enabled
    checkDatesInRangeAreEnabled({ start: 1, end: 11 }, allDatesInMonth);

    // range 2 15th - 21st
    // inactive period 12th - 14th
    checkDatesInRangeAreDisabled({ start: 12, end: 14 }, allDatesInMonth);
    checkDatesInRangeAreEnabled({ start: 15, end: 21 }, allDatesInMonth);

    // range 3 25th - 29th
    // inactive period 22nd - 24th
    checkDatesInRangeAreDisabled({ start: 22, end: 24 }, allDatesInMonth);
    checkDatesInRangeAreEnabled({ start: 25, end: 29 }, allDatesInMonth);

    // ensure rest of month not covered in a range remains disabled
    checkDatesInRangeAreDisabled({ start: 30, end: 31 }, allDatesInMonth);
  });

  it('does not activate an un-available date when clicked', async () => {
    const { user } = renderComponent();

    const inputField = getInputField();
    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);
    // check date is not already active
    const twentiethOfJanuary = screen.getByText('20');
    expect(twentiethOfJanuary).toHaveAttribute('aria-selected', 'false');

    // click date
    // NOTE: Newer test lib would allow:
    // await user.click(button, {pointerEventsCheck: PointerEventsCheckLevel.Never});
    await act(async () => {
      twentiethOfJanuary.click(); // avoid pointer events: none issue
    });

    // check date is still not active
    expect(twentiethOfJanuary).toHaveAttribute('aria-selected', 'false');

    expect(inputField).toHaveValue('');
  });

  it('activates an available date when clicked', async () => {
    const { user } = renderComponent();

    const inputField = getInputField();
    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);
    // check date is not already activated
    const tenthOfJanuary = screen.getByText('10');
    expect(tenthOfJanuary).toHaveAttribute('aria-selected', 'false');

    // click date
    await user.click(tenthOfJanuary);

    // check date has been activated
    expect(tenthOfJanuary).toHaveAttribute('aria-selected', 'true');
    expect(inputField).toHaveValue('10/01/2024');
  });

  it('navigates to previous years', async () => {
    const { user } = renderComponent();

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // check current month and year is January 2024
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    const nextYearButton = screen.getByLabelText(
      'calendar view is open, switch to year view'
    );
    expect(nextYearButton).toBeInTheDocument();
    expect(screen.queryByText('2018')).not.toBeInTheDocument();

    // open year section view
    await user.click(nextYearButton);

    // navigate to 2018
    const year2018Button = screen.getByText('2018');
    expect(year2018Button).toBeInTheDocument();

    await user.click(year2018Button);

    // check its now at 2018
    expect(screen.getByText('January 2018')).toBeInTheDocument();
  });

  // ** The purpose of lastActivePeriodCallback callback is to expose data retrieved within the component to the parent level calling the MovementAwareDatePicker
  // ** if the ranges as passed TO the component theres no need to retrieve the values passed IN; Redundant flow
  it('does not call lastActivePeriodCallback when providedDateRanges passed via props and lastActivePeriodCallback passed', async () => {
    const lastActivePeriodCallbackTest = jest.fn();

    renderComponent({
      athleteId: 1,
      lastActivePeriodCallback: lastActivePeriodCallbackTest,
      providedDateRanges: [
        { start: '2024-01-06', end: '2024-01-10' },
        { start: '2024-01-13', end: '2024-01-28' },
        { start: '2024-01-30', end: '2024-01-31' },
      ],
    });

    expect(lastActivePeriodCallbackTest).toHaveBeenCalledTimes(0);
  });

  it('does not call lastActivePeriodCallback when providedDateRanges passed via props and lastActivePeriodCallback not passed', async () => {
    const lastActivePeriodCallbackTest = jest.fn();

    renderComponent({
      athleteId: 1,
      lastActivePeriodCallback: undefined,
      providedDateRanges: [
        { start: '2024-01-06', end: '2024-01-10' },
        { start: '2024-01-13', end: '2024-01-28' },
        { start: '2024-01-30', end: '2024-01-31' },
      ],
    });

    expect(lastActivePeriodCallbackTest).toHaveBeenCalledTimes(0);
  });

  it('does not call lastActivePeriodCallback when there are no active periods to pass (props not present and hook data not present) and lastActivePeriodCallback passed', async () => {
    const lastActivePeriodCallbackTest = jest.fn();

    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [],
        },
      },
    });

    renderComponent({
      athleteId: 1,
      lastActivePeriodCallback: lastActivePeriodCallbackTest,
      providedDateRanges: [],
    });

    expect(lastActivePeriodCallbackTest).toHaveBeenCalledTimes(0);
  });

  it('does not call lastActivePeriodCallback when there are no active periods to pass (props not present and hook data not present) and lastActivePeriodCallback not passed', async () => {
    const lastActivePeriodCallbackTest = jest.fn();

    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [],
        },
      },
    });

    renderComponent({
      athleteId: 1,
      lastActivePeriodCallback: undefined,
      providedDateRanges: [],
    });

    expect(lastActivePeriodCallbackTest).toHaveBeenCalledTimes(0);
  });
});

describe('MovementAwareDatePicker - using retrieved date ranges via hook', () => {
  beforeEach(() => {
    const fakeDate = new Date('2024-01-31T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
    // Mock the useGetAthleteDataQuery response
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [{ start: '2024-01-13', end: '2024-01-28' }],
        },
      },
    });
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: {
        eligible_ranges: [],
      },
    });
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    renderComponent({ athleteId: 1, providedDateRanges: [] });

    const inputField = getInputField();
    const openCalendarButton = getOpenCalendarButton();

    expect(inputField).toBeInTheDocument();
    expect(openCalendarButton).toBeInTheDocument();
  });

  it('renders the inputLabel when value passed', async () => {
    renderComponent({ inputLabel: 'my lovely label' });

    const inputLabel = screen.getByText('my lovely label');

    expect(inputLabel).toBeInTheDocument();
  });

  it('correctly applies MUI theme styles', async () => {
    const { user } = renderComponent();

    const inputWrapper = getInputField().parentNode;

    // Verify that the custom theme is applied to the date field
    expect(inputWrapper).toHaveStyle({
      height: '2em',
      width: '18em',
    });

    // Verify that the custom theme is applied to the date popper
    const openCalendarButton = screen.getByLabelText('Choose date');
    await user.click(openCalendarButton);

    const popper = document.querySelector(
      '[role="dialog"].MuiPickersPopper-root'
    );

    expect(popper).toBeInTheDocument();

    expect(popper).toHaveStyle({
      zIndex: '2147483007',
    });
  });

  it('uses kitman invalid styles when isInvalid and kitmanDesignSystem = true', async () => {
    renderComponent({
      athleteId: 1,
      isInvalid: true,
      kitmanDesignSystem: true,
    });

    const inputField = getInputField();
    expect(getFieldSet(inputField)).toHaveStyle({
      border: `2px solid ${rootTheme.palette.error.light}`,
    });
  });

  it('uses MUI invalid styles when isInvalid = true and kitmanDesignSystem = false', async () => {
    renderComponent({ athleteId: 1, isInvalid: true });

    const inputField = getInputField();

    expect(getFieldSet(inputField)).toHaveStyle({
      border: `2px groove threedface`,
    });
  });

  it('does not set input field as invalid if isInvalid prop is undefined', async () => {
    renderComponent({ athleteId: 1 });

    const inputField = getInputField();

    expect(inputField).not.toHaveClass('Mui-error');
  });

  it('toggles (opens and closes) calendar view when button clicked', async () => {
    const { user } = renderComponent();

    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);
    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    expect(screen.getByText('January 2024')).toBeInTheDocument();

    expect(allDatesInMonth).toHaveLength(35);

    // close calendar view
    await user.click(openCalendarButton);
    const calendar2 = screen.queryByRole('grid');
    expect(calendar2).not.toBeInTheDocument();

    expect(screen.queryByText('January 2024')).not.toBeInTheDocument();
    expect(calendar2?.querySelectorAll('button[role="gridcell"]')).toBe(
      undefined
    ); // No numbered date elements to count if no calendar popper
  });

  it('toggles (opens and closes) calendar view when the input field is clicked', async () => {
    const { user } = renderComponent();

    const inputField = getInputField();

    // open calendar view
    await user.click(inputField);
    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    expect(screen.getByText('January 2024')).toBeInTheDocument();

    expect(allDatesInMonth).toHaveLength(35);

    // close calendar view
    await user.click(inputField);
    const calendar2 = screen.queryByRole('grid');
    expect(calendar2).not.toBeInTheDocument();
    expect(calendar2?.querySelectorAll('button[role="gridcell"]')).toBe(
      undefined
    ); // No numbered date elements to count if no calendar popper

    expect(screen.queryByText('January 2024')).not.toBeInTheDocument();
  });

  it('enables the correct dates', async () => {
    const { user } = renderComponent({ athleteId: 1, providedDateRanges: [] });

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);
    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    // First 12 date buttons should be disabled
    checkDatesInRangeAreDisabled({ start: 1, end: 12 }, allDatesInMonth);

    // 13th to 28th should be enabled
    checkDatesInRangeAreEnabled({ start: 13, end: 28 }, allDatesInMonth);

    // 29th to 31th should be disabled
    checkDatesInRangeAreDisabled({ start: 29, end: 31 }, allDatesInMonth);
  });

  it('does not enable dates outside of specified range', async () => {
    // Date range received from BE = [{ start: '2024-01-13', end: '2024-01-28' }],
    const { user } = renderComponent({
      athleteId: 1,
    });

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);
    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    // First 13th-28th date buttons should be enabled
    checkDatesInRangeAreEnabled({ start: 13, end: 28 }, allDatesInMonth);

    // Dates outside of specified range should be disabled
    checkDatesInRangeAreDisabled({ start: 29, end: 31 }, allDatesInMonth);
  });

  it('enables the correct dates when start date is null', async () => {
    // mock the useGetAthleteDataQuery response
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [{ start: null, end: '2024-02-07' }],
        },
      },
    });

    const { user } = renderComponent({ athleteId: 1, providedDateRanges: [] });

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // check current month is January and all dates are enabled
    const calendar = screen.getByRole('grid');
    const allDatesInJanuary = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    checkDatesInRangeAreEnabled({ start: 1, end: 31 }, allDatesInJanuary);

    // check current month is January and then navigate to December
    expect(screen.queryByText('December 2023')).not.toBeInTheDocument();
    const previousMonthButton = screen.getByTitle('Previous month');
    expect(screen.getByText('January 2024')).toBeInTheDocument();

    await user.click(previousMonthButton);

    // check current month is December and all dates are enabled
    const calendar2 = screen.getByRole('grid');
    const allDatesInDecember = calendar2.querySelectorAll(
      'button[role="gridcell"]'
    );

    expect(screen.queryByText('January 2024')).not.toBeInTheDocument();

    expect(screen.getByText('December 2023')).toBeInTheDocument();
    checkDatesInRangeAreEnabled({ start: 1, end: 31 }, allDatesInDecember);
  });

  it('enables the correct dates when end date is null and disableFuture is true', async () => {
    // mock the useGetAthleteDataQuery response
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [{ start: '2024-01-01', end: null }],
        },
      },
    });

    const { user } = renderComponent({ disableFuture: true });

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();

    await user.click(openCalendarButton);

    // check current month is January and all dates are enabled
    const calendar = screen.getByRole('grid');
    const allDatesInJanuary = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );
    checkDatesInRangeAreEnabled({ start: 1, end: 31 }, allDatesInJanuary);

    // check next month button is disabled
    const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
    expect(nextMonthButton).toBeDisabled();
  });

  it('enables the correct dates when constraints are null and disableFuture is true', async () => {
    // mock the useGetAthleteDataQuery response
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: null,
      },
    });

    const { user } = renderComponent({ disableFuture: true });

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();

    await user.click(openCalendarButton);

    // check current month is January and all dates are enabled
    const calendar = screen.getByRole('grid');
    const allDatesInJanuary = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );
    checkDatesInRangeAreEnabled({ start: 1, end: 31 }, allDatesInJanuary);

    // check next month button is disabled
    const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
    expect(nextMonthButton).toBeDisabled();
  });

  it('enables the correct dates when constraints are null and disableFuture is false', async () => {
    // mock the useGetAthleteDataQuery response
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: null,
      },
    });

    const { user } = renderComponent({ disableFuture: false });

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();

    await user.click(openCalendarButton);

    // check current month is January and all dates are enabled
    const calendar = screen.getByRole('grid');
    const allDatesInJanuary = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    expect(screen.getByText('January 2024')).toBeInTheDocument();
    checkDatesInRangeAreEnabled({ start: 1, end: 31 }, allDatesInJanuary);

    // check next month button is enabled
    const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
    expect(nextMonthButton).toBeEnabled();
  });

  it('enables the correct dates when no date ranges retrieved or athleteId passed and disableFuture is true', async () => {
    // BE will return the object but have null as the assigned values
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [{ start: null, end: null }],
        },
      },
    });

    const { user } = renderComponent({ disableFuture: true });

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // check current month is January and all dates are enabled
    const calendar = screen.getByRole('grid');
    const allDatesInJanuary = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );
    checkDatesInRangeAreEnabled({ start: 1, end: 31 }, allDatesInJanuary);

    // check next month button is disabled
    const nextMonthButton = screen.getByRole('button', { name: 'Next month' });
    expect(nextMonthButton).toBeDisabled();
  });

  it('enables the correct dates when multiple date ranges retrieved', async () => {
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [
            { start: '2024-01-06', end: '2024-01-10' },
            { start: '2024-01-13', end: '2024-01-28' },
            { start: '2024-01-30', end: '2024-01-31' },
          ],
        },
      },
    });

    const { user } = renderComponent({ athleteId: 1, providedDateRanges: [] });

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);

    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    // range 1 6th - 10th
    // inactive period 1st - 5th
    checkDatesInRangeAreDisabled({ start: 1, end: 5 }, allDatesInMonth);

    checkDatesInRangeAreEnabled({ start: 6, end: 10 }, allDatesInMonth);

    // range 2 13th - 28th
    // inactive period 11th - 12th
    checkDatesInRangeAreDisabled({ start: 11, end: 12 }, allDatesInMonth);
    checkDatesInRangeAreEnabled({ start: 13, end: 28 }, allDatesInMonth);

    // range 3 30th - 31st
    // inactive day 29th
    checkDatesInRangeAreDisabled({ start: 29, end: 29 }, allDatesInMonth);
    checkDatesInRangeAreEnabled({ start: 30, end: 31 }, allDatesInMonth);
  });

  it('enables the correct dates when FF[date-picker-allow-null-constraints] enabled', async () => {
    window.featureFlags['date-picker-allow-null-constraints'] = true;
    const fakeDate = new Date('2024-01-30T18:00:00Z'); // UTC FORMAT. Date before end of month
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);

    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: null,
      },
    });

    const { user } = renderComponent({
      athleteId: 1,
      providedDateRanges: [],
      disableFuture: true,
    });

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);

    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    checkDatesInRangeAreEnabled({ start: 1, end: 30 }, allDatesInMonth);
    // Future dates disabled
    checkDatesInRangeAreDisabled({ start: 31, end: 31 }, allDatesInMonth);
    window.featureFlags['date-picker-allow-null-constraints'] = false;
    jest.useRealTimers();
  });

  it('does not activate an un-available date when clicked', async () => {
    const { user } = renderComponent({ athleteId: 1, providedDateRanges: [] });

    const inputField = getInputField();
    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);

    // check date is not already active
    const twentyNinthOfJanuary = screen.getByText('29');
    expect(twentyNinthOfJanuary).toHaveAttribute('aria-selected', 'false');

    // click date
    // NOTE: Newer test lib would allow:
    // await user.click(button, {pointerEventsCheck: PointerEventsCheckLevel.Never});
    await act(async () => {
      twentyNinthOfJanuary.click(); // avoid pointer events: none issue
    });

    // check date is still not active
    expect(twentyNinthOfJanuary).toHaveAttribute('aria-selected', 'false');

    expect(inputField).toHaveValue('');
  });

  it('activates an available date when clicked', async () => {
    const { user } = renderComponent({
      athleteId: 1,
      providedDateRanges: [],
      onChange: jest.fn(),
    });

    const inputField = getInputField();
    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);

    // check date is not already activated
    const twentyEighthOfJanuary = screen.getByText('28');
    expect(twentyEighthOfJanuary).toHaveAttribute('aria-selected', 'false');

    // click date
    await user.click(twentyEighthOfJanuary);

    // check date has been activated
    expect(twentyEighthOfJanuary).toHaveAttribute('aria-selected', 'true');

    expect(inputField).toHaveValue('28/01/2024');
  });

  it('navigates to previous years', async () => {
    const { user } = renderComponent({
      providedDateRanges: [{ start: null, end: '2024-02-07' }],
      onChange: jest.fn(),
    });

    // open calendar view
    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // check current month and year is January 2024
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    const nextYearButton = screen.getByLabelText(
      'calendar view is open, switch to year view'
    );
    expect(nextYearButton).toBeInTheDocument();
    expect(screen.queryByText('2018')).not.toBeInTheDocument();

    // open year section view
    await user.click(nextYearButton);

    // navigate to 2018
    const year2018Button = screen.getByText('2018');
    expect(year2018Button).toBeInTheDocument();

    await user.click(year2018Button);

    // check its now at 2018
    expect(screen.getByText('January 2018')).toBeInTheDocument();
  });

  // ** The purpose of lastActivePeriodCallback callback is to expose data retrieved within the component to the parent level calling the MovementAwareDatePicker
  // ** if the ranges as passed TO the component theres no need to retrieve the values passed IN; Redundant flow

  it('calls lastActivePeriodCallback with the correct value when there are new active periods', async () => {
    const lastActivePeriodCallbackTest = jest.fn();
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [
            { start: '2024-01-06', end: '2024-01-10' },
            { start: '2024-01-13', end: '2024-01-28' },
            { start: '2024-01-30', end: '2024-01-31' },
          ],
        },
      },
    });

    renderComponent({
      athleteId: 1,
      lastActivePeriodCallback: lastActivePeriodCallbackTest,
    });

    expect(lastActivePeriodCallbackTest).toHaveBeenCalledTimes(1);
    expect(lastActivePeriodCallbackTest).toHaveBeenCalledWith({
      end: '2024-01-31',
      start: '2024-01-30',
    });
  });

  it('does not call lastActivePeriodCallback when there are new active periods but prop is not passed', async () => {
    const lastActivePeriodCallbackTest = jest.fn();
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [
            { start: '2024-01-06', end: '2024-01-10' },
            { start: '2024-01-13', end: '2024-01-28' },
            { start: '2024-01-30', end: '2024-01-31' },
          ],
        },
      },
    });

    renderComponent({
      athleteId: 1,
      lastActivePeriodCallback: undefined,
    });

    expect(lastActivePeriodCallbackTest).not.toHaveBeenCalled();
  });

  it('does not call lastActivePeriodCallback when there are no active periods to pass and lastActivePeriodCallback passed', async () => {
    const lastActivePeriodCallbackTest = jest.fn();
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [],
        },
      },
    });

    renderComponent({
      athleteId: 1,
      lastActivePeriodCallback: lastActivePeriodCallbackTest,
      providedDateRanges: [],
    });

    expect(lastActivePeriodCallbackTest).toHaveBeenCalledTimes(0);
  });

  it('does not call lastActivePeriodCallback when there are no active periods to pass lastActivePeriodCallback not passed', async () => {
    const lastActivePeriodCallbackTest = jest.fn();
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [],
        },
      },
    });

    renderComponent({
      athleteId: 1,
      lastActivePeriodCallback: undefined,
      providedDateRanges: [],
    });

    expect(lastActivePeriodCallbackTest).toHaveBeenCalledTimes(0);
  });
});

describe('MovementAwareDatePicker - MultiDate mode', () => {
  beforeEach(() => {
    const fakeDate = new Date('2024-01-31T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
    // Mock the useGetAthleteDataQuery response
    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [{ start: '2024-01-13', end: '2024-01-28' }],
        },
      },
    });
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: {
        eligible_ranges: [],
      },
    });
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('enables the correct dates when multiple date ranges passed', async () => {
    const onChangeCallback = jest.fn();
    const { user } = renderComponent({
      athleteId: 1,
      providedDateRanges: [
        { start: '2024-01-01', end: '2024-01-11' },
        { start: '2024-01-15', end: '2024-01-21' },
        { start: '2024-01-25', end: '2024-01-29' },
      ],
      onChange: onChangeCallback,
      multiDate: true,
      value: [moment('2024-01-26'), moment('2024-01-27')],
    });

    // Renders the selections as short dates to the input field
    expect(screen.getByRole('textbox')).toHaveValue('01/26/2024, 01/27/2024');

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);
    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    const dateChip1 = screen.getByText('01/26/2024');
    const dateChip2 = screen.getByText('01/27/2024');

    expect(dateChip1).toHaveClass('MuiChip-label');
    expect(dateChip2).toHaveClass('MuiChip-label');

    const twentyFifthOfJanuary = screen.getByText('25');
    expect(twentyFifthOfJanuary).not.toHaveClass('Mui-selected');

    // check value dates are already activated
    const twentySixthOfJanuary = screen.getByText('26');
    expect(twentySixthOfJanuary).toHaveClass('Mui-selected');

    const twentySeventhOfJanuary = screen.getByText('27');
    expect(twentySeventhOfJanuary).toHaveClass('Mui-selected');

    // range 1 1st - 11th
    // first 11 date buttons should be enabled
    checkDatesInRangeAreEnabled({ start: 1, end: 11 }, allDatesInMonth);

    // range 2 15th - 21st
    // inactive period 12th - 14th
    checkDatesInRangeAreDisabled({ start: 12, end: 14 }, allDatesInMonth);
    checkDatesInRangeAreEnabled({ start: 15, end: 21 }, allDatesInMonth);

    // range 3 25th - 29th
    // inactive period 22nd - 24th
    checkDatesInRangeAreDisabled({ start: 22, end: 24 }, allDatesInMonth);
    checkDatesInRangeAreEnabled({ start: 25, end: 29 }, allDatesInMonth);

    // ensure rest of month not covered in a range remains disabled
    checkDatesInRangeAreDisabled({ start: 30, end: 31 }, allDatesInMonth);
  });

  it('does not activate an un-available date when clicked', async () => {
    const onChangeCallback = jest.fn();
    const { user } = renderComponent({
      ...defaultProps,
      onChange: onChangeCallback,
      multiDate: true,
      value: [],
    });

    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);

    // check date is not already active
    const twentiethOfJanuary = screen.getByText('20');
    expect(twentiethOfJanuary).toHaveAttribute('aria-selected', 'false');
    expect(twentiethOfJanuary).not.toHaveClass('Mui-selected');

    // click date
    // NOTE: Newer test lib would allow:
    // await user.click(button, {pointerEventsCheck: PointerEventsCheckLevel.Never});
    await act(async () => {
      twentiethOfJanuary.click(); // avoid pointer events: none issue
    });

    // check date is still not active
    expect(twentiethOfJanuary).toHaveAttribute('aria-selected', 'false');
    expect(twentiethOfJanuary).not.toHaveClass('Mui-selected');

    expect(onChangeCallback).not.toHaveBeenCalled();
  });

  it('activates an available date when clicked', async () => {
    const onChangeCallback = jest.fn();

    const { user } = renderComponent({
      athleteId: 1,
      providedDateRanges: [],
      onChange: onChangeCallback,
      multiDate: true,
      value: [],
    });

    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);

    // check date is not already activated
    const twentyEighthOfJanuary = screen.getByText('28');
    expect(twentyEighthOfJanuary).toHaveAttribute('aria-selected', 'false');
    expect(twentyEighthOfJanuary).not.toHaveClass('Mui-selected');

    // click date
    await user.click(twentyEighthOfJanuary);

    // check date has been activated
    expect(twentyEighthOfJanuary).toHaveAttribute('aria-selected', 'true');

    expect(onChangeCallback).toHaveBeenCalledTimes(1);
    const dates = onChangeCallback.mock.calls[0][0];
    expect(dates).toHaveLength(1);
    expect(dates[0].isSame(moment('2024-01-28'), 'date')).toEqual(true);
  });

  it('appends clicked date to array in onChangeCallback', async () => {
    const onChangeCallback = jest.fn();

    const { user } = renderComponent({
      athleteId: 1,
      providedDateRanges: [],
      onChange: onChangeCallback,
      multiDate: true,
      value: [moment('2024-01-27')],
    });

    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);

    // check value date is already activated
    const twentySeventhOfJanuary = screen.getByText('27');
    expect(twentySeventhOfJanuary).toHaveClass('Mui-selected');

    // check date is not already activated
    const twentyEighthOfJanuary = screen.getByText('28');
    expect(twentyEighthOfJanuary).not.toHaveClass('Mui-selected');

    // click date
    await user.click(twentyEighthOfJanuary);

    // check date has been activated
    expect(twentyEighthOfJanuary).toHaveAttribute('aria-selected', 'true');

    expect(onChangeCallback).toHaveBeenCalledTimes(1);
    const dates = onChangeCallback.mock.calls[0][0];
    expect(dates).toHaveLength(2);
    expect(dates[0].isSame(moment('2024-01-27'), 'date')).toEqual(true);
    expect(dates[1].isSame(moment('2024-01-28'), 'date')).toEqual(true);
  });
});

describe('MovementAwareDatePicker - with Ancillary Ranges', () => {
  beforeEach(() => {
    const fakeDate = new Date('2024-01-31T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);

    useGetAthleteDataQuery.mockReturnValue({
      data: {
        constraints: {
          active_periods: [],
        },
      },
    });

    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: {
        eligible_ranges: [{ start: '2024-01-15', end: '2024-01-20' }],
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    window.getFlag.mockClear();
  });

  it('enables ancillary date ranges when feature flag is on and prop is true', async () => {
    window.getFlag = jest.fn().mockReturnValue(true);

    const { user } = renderComponent({
      ...defaultProps,
      inclundeAncillaryRanges: true,
    });

    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    // Default provided range: 1st-11th
    checkDatesInRangeAreEnabled({ start: 1, end: 11 }, allDatesInMonth);
    // Ancillary range: 15th-20th
    checkDatesInRangeAreEnabled({ start: 15, end: 20 }, allDatesInMonth);

    // Dates outside of ranges should be disabled
    checkDatesInRangeAreDisabled({ start: 12, end: 14 }, allDatesInMonth);
    checkDatesInRangeAreDisabled({ start: 21, end: 31 }, allDatesInMonth);
  });

  it('does not enable ancillary date ranges when feature flag is off', async () => {
    window.getFlag = jest.fn().mockReturnValue(false);

    const { user } = renderComponent({
      ...defaultProps,
      inclundeAncillaryRanges: true,
    });

    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    // Default provided range: 1st-11th
    checkDatesInRangeAreEnabled({ start: 1, end: 11 }, allDatesInMonth);

    // Ancillary range should be disabled
    checkDatesInRangeAreDisabled({ start: 12, end: 31 }, allDatesInMonth);
  });

  it('does not enable ancillary date ranges when prop is false', async () => {
    window.getFlag = jest.fn().mockReturnValue(true);

    const { user } = renderComponent({
      ...defaultProps,
      inclundeAncillaryRanges: false,
    });

    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    const calendar = screen.getByRole('grid');
    const allDatesInMonth = calendar.querySelectorAll(
      'button[role="gridcell"]'
    );

    // Default provided range: 1st-11th
    checkDatesInRangeAreEnabled({ start: 1, end: 11 }, allDatesInMonth);

    // Ancillary range should be disabled
    checkDatesInRangeAreDisabled({ start: 12, end: 31 }, allDatesInMonth);
  });
});
