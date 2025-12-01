import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

import DatePickerWrapper from '../index';

const renderTestComponent = (props) => {
  // Render DatePickerWrapper component with Moment adapter
  render(
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePickerWrapper {...props} />
    </LocalizationProvider>
  );
};

const getOpenCalendarButton = () => {
  return screen.getByLabelText('Choose date');
};

const getInputField = () => {
  return screen.getByPlaceholderText('MM/DD/YYYY');
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

describe('DatePickerWrapper', () => {
  let user;
  beforeAll(() => {
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  });
  beforeEach(() => {
    const fakeDate = new Date('2024-01-31T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', async () => {
    renderTestComponent();

    const inputField = getInputField();
    const openCalendarButton = getOpenCalendarButton();

    expect(inputField).toBeInTheDocument();
    expect(openCalendarButton).toBeInTheDocument();
  });

  it('renders the inputLabel when value passed', async () => {
    renderTestComponent({ inputLabel: 'my lovely label' });

    const inputLabel = screen.getByText('my lovely label');

    expect(inputLabel).toBeInTheDocument();
  });

  it('renders the placeholder when value passed', async () => {
    renderTestComponent({ placeholder: 'my lovely placeholder' });

    const inputLabel = screen.getByPlaceholderText('my lovely placeholder');

    expect(inputLabel).toBeInTheDocument();
  });

  it('correctly applies MUI theme styles', async () => {
    renderTestComponent();

    let popper;
    const inputWrapper = getInputField().parentNode;

    // Verify that the custom theme is applied to the date field
    expect(inputWrapper).toHaveStyle({
      height: '3rem',
    });

    // Verify that the custom theme is applied to the date popper
    const openCalendarButton = screen.getByLabelText('Choose date');
    await user.click(openCalendarButton);

    await waitFor(() => {
      popper = document.querySelector('[role="dialog"].MuiPickersPopper-root');

      expect(popper).toBeInTheDocument();
    });
    expect(popper).toHaveStyle({
      zIndex: '2147483007',
    });
  });

  it('displays input field as invalid when isInvalid prop is true', async () => {
    renderTestComponent({ isInvalid: true });

    const inputField = getInputField();
    expect(inputField.parentNode).toHaveClass('Mui-error');
  });

  it('does not set input field as invalid if isInvalid prop is undefined', async () => {
    renderTestComponent();

    const inputField = getInputField();
    expect(inputField).not.toHaveClass('Mui-error');
  });

  it('displays input field as valid when isInvalid prop is false', async () => {
    renderTestComponent({ isInvalid: false });

    const inputField = getInputField();
    expect(inputField).not.toHaveClass('Mui-error');
  });

  it('toggles (opens and closes) calendar view when button clicked', async () => {
    renderTestComponent();
    let allDatesInMonth;

    const openCalendarButton = getOpenCalendarButton();

    // open calendar view
    await user.click(openCalendarButton);
    await waitFor(async () => {
      const calendar = screen.getByRole('grid');
      allDatesInMonth = calendar.querySelectorAll('button[role="gridcell"]');

      expect(screen.getByText('January 2024')).toBeInTheDocument();
    });
    expect(allDatesInMonth).toHaveLength(31);

    // close calendar view
    await user.click(openCalendarButton);
    await waitFor(async () => {
      const calendar = screen.queryByRole('grid');
      expect(calendar).not.toBeInTheDocument();
      allDatesInMonth = calendar?.querySelectorAll('button[role="gridcell"]');
    });
    expect(screen.queryByText('January 2024')).not.toBeInTheDocument();
    expect(allDatesInMonth).toBe(undefined); // no numbered date elements to count if no calendar popper
  });

  it('toggles (opens and closes) calendar view when the input field is clicked', async () => {
    renderTestComponent();
    let allDatesInMonth;

    const inputField = getInputField();

    // open calendar view
    await user.click(inputField);
    await waitFor(async () => {
      const calendar = screen.getByRole('grid');
      allDatesInMonth = calendar.querySelectorAll('button[role="gridcell"]');

      expect(screen.getByText('January 2024')).toBeInTheDocument();
    });
    expect(allDatesInMonth).toHaveLength(31);

    // close calendar view
    await user.click(inputField);
    await waitFor(async () => {
      const calendar = screen.queryByRole('grid');
      expect(calendar).not.toBeInTheDocument();
      allDatesInMonth = calendar?.querySelectorAll('button[role="gridcell"]');
    });
    expect(screen.queryByText('January 2024')).not.toBeInTheDocument();
    expect(allDatesInMonth).toBe(undefined); // no numbered date elements to count if no calendar popper
  });

  it('disables the correct date for date value', async () => {
    const disableJanuaryTwelfth = (date) => {
      const isTargetDate = moment(date.toDate().toString()).isSame(
        '2024-01-12'
      );

      return isTargetDate;
    };

    renderTestComponent({
      shouldDisableDate: (date) => {
        return disableJanuaryTwelfth(date);
      },
    });
    let allDatesInMonth;

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);
    await waitFor(async () => {
      const calendar = screen.getByRole('grid');
      allDatesInMonth = calendar.querySelectorAll('button[role="gridcell"]');

      // First 11 dates enabled
      checkDatesInRangeAreEnabled({ start: 1, end: 11 }, allDatesInMonth);
    });
    // Only Jan 12th disabled
    checkDatesInRangeAreDisabled({ start: 12, end: 12 }, allDatesInMonth);
    checkDatesInRangeAreEnabled({ start: 13, end: 31 }, allDatesInMonth);
  });

  it('disables the correct dates for range', async () => {
    const disableDates = (date) => {
      const dateRange = [
        {
          start: '2024-01-12',
          end: '2024-01-31',
        },
      ];

      return dateRange.some(
        (range) =>
          date.toDate() >= new Date(range.start) &&
          date.toDate() <= new Date(range.end)
      );
    };

    renderTestComponent({
      shouldDisableDate: (date) => {
        return disableDates(date);
      },
    });
    let allDatesInMonth;

    const openCalendarButton = getOpenCalendarButton();

    expect(openCalendarButton).toBeInTheDocument();

    // open calendar view
    await user.click(openCalendarButton);
    await waitFor(async () => {
      const calendar = screen.getByRole('grid');
      allDatesInMonth = calendar.querySelectorAll('button[role="gridcell"]');

      // First 11 date buttons should be the only dates enabled
      checkDatesInRangeAreEnabled({ start: 1, end: 11 }, allDatesInMonth);
    });
    checkDatesInRangeAreDisabled({ start: 12, end: 31 }, allDatesInMonth);
  });
});
