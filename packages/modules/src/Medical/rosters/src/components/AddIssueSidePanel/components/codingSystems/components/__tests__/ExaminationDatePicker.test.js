import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';

import {
  useGetAncillaryEligibleRangesQuery,
  useGetAthleteDataQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import ExaminationDatePicker from '../ExaminationDatePicker';

// Mock the moment library
jest.mock('moment', () => jest.requireActual('moment'));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAncillaryEligibleRangesQuery: jest.fn(),
    useGetAthleteDataQuery: jest.fn(),
  })
);

const defaultProps = {
  athleteId: 123,
  athleteData: {
    constraints: {
      active_periods: [],
    },
  },
  examinationDateProps: {
    selectedDiagnosisDate: null,
    selectedExaminationDate: null,
  },
  isEditMode: false,
  getFieldLabel: jest.fn((field) => `${field} label`),
  maxPermittedExaminationDate: null,
  onSelectExaminationDate: jest.fn(),
  onChangedate: jest.fn(),
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
  },
});

const renderComponent = (props = defaultProps) => ({
  user: userEvent.setup({ advanceTimers: jest.advanceTimersByTime }),
  ...render(
    <Provider store={defaultStore}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <ExaminationDatePicker {...defaultProps} {...props} />
      </LocalizationProvider>
    </Provider>
  ),
});

const getOpenCalendarButton = () => {
  return screen.getByLabelText('Choose date');
};

function checkDaysAreEnabled(startDay, endDay) {
  for (let day = startDay; day <= endDay; day++) {
    const dayButtons = screen.getAllByRole('gridcell', { name: day });

    expect(dayButtons[0]).toHaveTextContent(day);
    expect(dayButtons[0]).toBeInTheDocument();
    expect(dayButtons[0]).toBeEnabled();
  }
}

describe('ExaminationDatePicker', () => {
  beforeEach(() => {
    const fakeDate = new Date('2025-04-28');
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);

    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [],
    });
    useGetAthleteDataQuery.mockReturnValue({
      data: {},
    });
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders the Date picker component', () => {
    renderComponent();
    expect(screen.getByText('Date of examination')).toBeInTheDocument();
  });

  it('calculates the correct maxDate when min date is from activePeriod and max date is todays date', async () => {
    // Note: todays date is 28th of June 2025
    const dateOfInjury = '2025-04-18';
    const activePeriodStart = '2025-04-03';
    const activePeriodEnd = '2025-04-21';
    const ancillaryRangeStart = '2025-04-08';
    const ancillaryRangeEnd = '2025-04-23';
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [{ start: ancillaryRangeStart, end: ancillaryRangeEnd }],
    });
    const { user } = renderComponent({
      examinationDateProps: {
        selectedDiagnosisDate: dateOfInjury,
        selectedExaminationDate: null,
      },
      athleteData: {
        constraints: {
          active_periods: [{ start: activePeriodStart, end: activePeriodEnd }],
        },
      },
    });
    const openCalendarButton = getOpenCalendarButton();

    // Open calendar
    await user.click(openCalendarButton);

    // Expect the available range to be: min = activePeriodStart (earliest date being the 3rd)
    // max = fakeDate (todays date 28th as its the furthest date of all sources whiles not exceeding todays date)
    await screen.findByText(/April 2025/);

    expect(screen.getAllByRole('gridcell', { name: '1' })[0]).toBeDisabled();
    expect(screen.getAllByRole('gridcell', { name: '2' })[0]).toBeDisabled();
    checkDaysAreEnabled(3, 28);
    expect(screen.getByRole('gridcell', { name: '29' })).toBeDisabled();
    expect(screen.getByRole('gridcell', { name: '30' })).toBeDisabled();
  });

  it('calculates the correct maxDate when min date is from ancillaryRange and max date is todays date', async () => {
    // Note: todays date is 28th of June 2025
    const dateOfInjury = '2025-04-18';
    const activePeriodStart = '2025-04-03';
    const activePeriodEnd = '2025-04-21';
    const ancillaryRangeStart = '2025-04-02';
    const ancillaryRangeEnd = '2025-04-23';
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [{ start: ancillaryRangeStart, end: ancillaryRangeEnd }],
    });
    const { user } = renderComponent({
      examinationDateProps: {
        selectedDiagnosisDate: dateOfInjury,
        selectedExaminationDate: null,
      },
      athleteData: {
        constraints: {
          active_periods: [{ start: activePeriodStart, end: activePeriodEnd }],
        },
      },
    });
    const openCalendarButton = getOpenCalendarButton();

    // Open calendar
    await user.click(openCalendarButton);

    // Expect the available range to be: min = ancillaryRangeStart (earliest date being the 2nd)
    // max = fakeDate (todays date 28th as its the furthest date of all sources whiles not exceeding todays date)
    await screen.findByText(/April 2025/);

    expect(screen.getAllByRole('gridcell', { name: '1' })[0]).toBeDisabled();
    checkDaysAreEnabled(2, 28);
    expect(screen.getByRole('gridcell', { name: '29' })).toBeDisabled();
    expect(screen.getByRole('gridcell', { name: '30' })).toBeDisabled();
  });

  it('calculates the correct range when only active_periods are provided', async () => {
    // Note: todays date is 28th of April 2025
    const dateOfInjury = '2025-04-18';
    const activePeriodStart = '2025-04-05';
    const activePeriodEnd = '2025-04-22';
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [],
    });
    const { user } = renderComponent({
      examinationDateProps: {
        selectedDiagnosisDate: dateOfInjury,
        selectedExaminationDate: null,
      },
      athleteData: {
        constraints: {
          active_periods: [{ start: activePeriodStart, end: activePeriodEnd }],
        },
      },
    });
    const openCalendarButton = getOpenCalendarButton();

    // Open calendar
    await user.click(openCalendarButton);

    // Expect the available range to be: min = activePeriodStart (earliest date being the 5th)
    // max = fakeDate (todays date 28th)
    await screen.findByText(/April 2025/);

    expect(screen.getAllByRole('gridcell', { name: '1' })[0]).toBeDisabled();
    expect(screen.getAllByRole('gridcell', { name: '2' })[0]).toBeDisabled();
    expect(screen.getAllByRole('gridcell', { name: '3' })[0]).toBeDisabled();
    expect(screen.getAllByRole('gridcell', { name: '4' })[0]).toBeDisabled();
    checkDaysAreEnabled(5, 28);
    expect(screen.getByRole('gridcell', { name: '29' })).toBeDisabled();
    expect(screen.getByRole('gridcell', { name: '30' })).toBeDisabled();
  });

  it('calculates the correct range when only ancillary ranges are provided', async () => {
    // Note: todays date is 28th of April 2025
    const dateOfInjury = '2025-04-18';
    const ancillaryRangeStart = '2025-04-07';
    const ancillaryRangeEnd = '2025-04-24';
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [{ start: ancillaryRangeStart, end: ancillaryRangeEnd }],
    });
    const { user } = renderComponent({
      examinationDateProps: {
        selectedDiagnosisDate: dateOfInjury,
        selectedExaminationDate: null,
      },
      athleteData: {
        constraints: {
          active_periods: [],
        },
      },
    });
    const openCalendarButton = getOpenCalendarButton();

    // Open calendar
    await user.click(openCalendarButton);

    // Expect the available range to be: min = ancillaryRangeStart (earliest date being the 7th)
    // max = fakeDate (todays date 28th)
    await screen.findByText(/April 2025/);

    expect(screen.getAllByRole('gridcell', { name: '1' })[0]).toBeDisabled();
    expect(screen.getAllByRole('gridcell', { name: '6' })[0]).toBeDisabled();
    checkDaysAreEnabled(7, 28);
    expect(screen.getByRole('gridcell', { name: '29' })).toBeDisabled();
    expect(screen.getByRole('gridcell', { name: '30' })).toBeDisabled();
  });

  it('calculates the correct minDate from multiple mixed date ranges', async () => {
    // Note: todays date is 28th of April 2025
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [
        { start: '2025-04-06', end: '2025-04-25' }, // Earliest ancillary range first
        { start: '2025-04-15', end: '2025-04-20' },
      ],
    });
    const { user } = renderComponent({
      athleteData: {
        constraints: {
          active_periods: [
            { start: '2025-04-04', end: '2025-04-08' }, // Earliest active period first
            { start: '2025-04-10', end: '2025-04-15' },
          ],
        },
      },
    });
    const openCalendarButton = getOpenCalendarButton();

    // Open calendar
    await user.click(openCalendarButton);

    // April 4th as the minimum date.
    await screen.findByText(/April 2025/);

    expect(screen.getAllByRole('gridcell', { name: '3' })[0]).toBeDisabled();
    checkDaysAreEnabled(4, 28);
    expect(screen.getAllByRole('gridcell', { name: '29' })[0]).toBeDisabled();
    expect(screen.getAllByRole('gridcell', { name: '30' })[0]).toBeDisabled();
  });

  it('calculates the correct maxDate from multiple mixed date ranges', async () => {
    // Note: todays date is 28th of April 2025. The 'disableFuture' prop caps the max date to today.
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [
        { start: '2025-04-02', end: '2025-05-12' }, // Latest end date from this source
        { start: '2025-04-08', end: '2025-04-20' },
      ],
    });

    const { user } = renderComponent({
      athleteData: {
        constraints: {
          active_periods: [
            { start: '2025-04-01', end: '2025-04-15' }, // Earliest start date is here
            { start: '2025-04-10', end: '2025-05-22' }, // The overall latest end date is here
          ],
        },
      },
    });

    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // The min date is April 1st (from active_periods).
    // The max date from all ranges is May 22nd, but `disableFuture` limits it to April 28th.
    await screen.findByText(/April 2025/);

    // Check that days from the 1st to the 28th are enabled.
    checkDaysAreEnabled(1, 28);

    // Assert that day 29 is disabled because of the `disableFuture` prop.
    expect(screen.getByRole('gridcell', { name: '29' })).toBeDisabled();
  });

  it('calculates the correct minDate from multiple active periods', async () => {
    // Note: todays date is 28th of April 2025
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: { eligible_ranges: [] }, // No ancillary ranges to isolate active_periods
    });

    const { user } = renderComponent({
      athleteData: {
        constraints: {
          active_periods: [
            { start: '2025-04-10', end: '2025-04-15' }, // This one is not the earliest
            { start: '2025-04-05', end: '2025-04-20' }, // This is the earliest start
          ],
        },
      },
    });

    const openCalendarButton = getOpenCalendarButton();

    // Open calendar
    await user.click(openCalendarButton);

    // Expect the available range to be: min = '2025-04-05' (the earliest of all active periods)
    // max = fakeDate (todays date 28th)
    await screen.findByText(/April 2025/);

    expect(screen.getAllByRole('gridcell', { name: '4' })[0]).toBeDisabled();
    checkDaysAreEnabled(5, 28);
    expect(screen.getByRole('gridcell', { name: '29' })).toBeDisabled();
  });

  it('calculates the correct maxDate from multiple active periods', async () => {
    // Note: todays date is 28th of April 2025. The 'disableFuture' prop caps the max date to today.
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [], // No ancillary ranges to isolate the active_periods logic
    });

    const { user } = renderComponent({
      athleteData: {
        constraints: {
          active_periods: [
            { start: '2025-04-01', end: '2025-05-10' }, // This is not the latest end date
            { start: '2025-04-05', end: '2025-05-20' }, // This is the actual latest end date
          ],
        },
      },
    });

    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // The min date is April 1st.
    // The max date from the active periods is May 20th, but `disableFuture` limits it to April 28th.
    await screen.findByText(/April 2025/);

    // Check that days from the 1st to the 28th are enabled.
    checkDaysAreEnabled(1, 28);

    // Assert that day 29 is disabled because of the `disableFuture` prop.
    expect(screen.getByRole('gridcell', { name: '29' })).toBeDisabled();
  });

  it('calculates the correct minDate from multiple ancillary ranges', async () => {
    // Note: todays date is 28th of April 2025
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [
        { start: '2025-04-12', end: '2025-04-18' }, // This range is not the earliest
        { start: '2025-04-07', end: '2025-04-22' }, // This is the actual earliest start date
      ],
    });

    const { user } = renderComponent({
      // Provide empty active_periods to isolate the ancillary ranges logic
      athleteData: {
        constraints: {
          active_periods: [],
        },
      },
    });

    const openCalendarButton = getOpenCalendarButton();

    // Open calendar
    await user.click(openCalendarButton);

    // Expect the available range to be: min = '2025-04-07' (the earliest of all ancillary ranges)
    // max = fakeDate (todays date 28th)
    await screen.findByText(/April 2025/);

    // Assert that days before the 7th are disabled
    expect(screen.getAllByRole('gridcell', { name: '6' })[0]).toBeDisabled();

    // Assert that days from the 7th to the 28th (today) are enabled
    checkDaysAreEnabled(7, 28);

    // Assert that days after the 28th are disabled
    expect(screen.getByRole('gridcell', { name: '29' })).toBeDisabled();
  });

  it('calculates the correct maxDate from multiple ancillary ranges', async () => {
    // Note: todays date is 28th of April 2025.
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [
        { start: '2025-04-10', end: '2025-05-15' },
        { start: '2025-04-05', end: '2025-05-25' }, // The latest end date is May 25th
      ],
    });

    const { user } = renderComponent({
      // Provide empty active_periods to isolate the ancillary ranges logic
      athleteData: {
        constraints: {
          active_periods: [],
        },
      },
    });

    const openCalendarButton = getOpenCalendarButton();
    await user.click(openCalendarButton);

    // The min date is April 5th.
    // The max date from ranges is May 25th, but the `disableFuture` prop limits it to April 28th.
    await screen.findByText(/April 2025/);
    expect(screen.getAllByRole('gridcell', { name: '4' })[0]).toBeDisabled();

    // Check that days from the 5th to the 28th (today) are enabled
    checkDaysAreEnabled(5, 28);

    // Assert that day 29 is disabled because of the `disableFuture` prop
    expect(screen.getByRole('gridcell', { name: '29' })).toBeDisabled();

    // There is no need to navigate to May, as all future dates are disabled.
  });
});
