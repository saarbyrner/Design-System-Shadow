import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import EventDateTime from '../EventDateTime';

const july12th2021 = new Date('2021-07-12T10:00:16.000Z');

jest.useFakeTimers().setSystemTime(july12th2021);

moment.tz.setDefault('UTC');

describe('PlanningEventSidePanel <EventDateTime /> component', () => {
  const simpleValidResult = {
    isInvalid: false,
  };

  const testValidity = {
    duration: simpleValidResult,
    local_timezone: simpleValidResult,
    start_time: simpleValidResult,
    title: simpleValidResult,
  };

  const props = {
    eventDate: moment(july12th2021),
    timeZone: 'Europe/Dublin',
    duration: 10,
    eventValidity: testValidity,
    disableDateTimeEdit: false,
    onSelectDate: jest.fn(),
    onUpdateStartTime: jest.fn(),
    onUpdateDuration: jest.fn(),
    onSelectTimezone: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const dateText = 'Date';
  const startTimeText = 'Start Time';
  const durationText = 'Duration';
  const timeZoneText = 'Timezone';

  const getDateInput = () => screen.getByLabelText(dateText);

  const getStartTimeInput = () => {
    const startTimeLabel = screen.getByText(startTimeText);
    return startTimeLabel.parentElement.querySelector('input');
  };

  const getDurationInput = () => {
    const durationLabel = screen.getByText(durationText);
    return durationLabel.parentElement.parentElement.querySelector('input');
  };

  const getTimeZoneDisabledValueContainer = () => {
    const timezoneLabel = screen.getByText(timeZoneText);
    return timezoneLabel.parentElement.parentElement.querySelector(
      '.kitmanReactSelect--is-disabled'
    );
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders', () => {
    render(<EventDateTime {...props} />);
    expect(screen.getByText(dateText)).toBeInTheDocument();
  });

  it('renders all sub-components', () => {
    render(<EventDateTime {...props} />);

    expect(screen.getByText(dateText)).toBeInTheDocument();

    expect(screen.getByText(startTimeText)).toBeInTheDocument();

    expect(screen.getByText(durationText)).toBeInTheDocument();
    expect(screen.getByDisplayValue(props.duration)).toBeInTheDocument();

    expect(screen.getByText(timeZoneText)).toBeInTheDocument();
    expect(screen.getByText(props.timeZone)).toBeInTheDocument();
  });

  it('disables the components when is disableDateTimeEdit is true (besides duration)', () => {
    render(<EventDateTime {...props} disableDateTimeEdit />);

    expect(getDateInput()).toBeDisabled();

    expect(getStartTimeInput()).toBeDisabled();

    expect(getDurationInput()).toBeEnabled();

    expect(getTimeZoneDisabledValueContainer()).toBeInTheDocument();
  });

  it('enables the components when is disableDateTimeEdit is false', () => {
    render(<EventDateTime {...props} />);

    expect(getDateInput()).toBeEnabled();

    expect(getStartTimeInput()).toBeEnabled();

    expect(getDurationInput()).toBeEnabled();

    expect(getTimeZoneDisabledValueContainer()).not.toBeInTheDocument();
  });

  it('applies the correct date, time, duration and timezone values', () => {
    render(<EventDateTime {...props} />);

    expect(getDateInput()).toHaveValue('12 Jul 2021');

    expect(getStartTimeInput()).toHaveValue('10:00 am');

    expect(getDurationInput()).toHaveValue(props.duration);

    expect(screen.getByText(props.timeZone)).toBeInTheDocument();
  });

  it('calls the callbacks when inputs changed', async () => {
    render(<EventDateTime {...props} />);

    const startTimeInput = getStartTimeInput();
    await userEvent.click(startTimeInput);
    await userEvent.click(screen.getAllByText('09')[0]);
    await userEvent.click(screen.getByText('15'));
    await userEvent.click(screen.getByText('pm'));

    expect(props.onUpdateStartTime).toHaveBeenCalled();

    const durationInput = getDurationInput();

    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, '50');

    expect(props.onUpdateDuration).toHaveBeenCalled();
  });

  it('marks inputs as invalid when required by eventValidity', () => {
    const invalidResults = {
      duration: {
        isInvalid: true,
      },
      local_timezone: {
        isInvalid: true,
      },
      start_time: {
        isInvalid: true,
      },
    };

    render(<EventDateTime {...props} eventValidity={invalidResults} />);

    const dateContainer =
      screen.getByText(dateText).parentElement.parentElement;
    expect(dateContainer).toHaveClass('inputText--invalid');

    const invalidDurationContainer = screen
      .getByText(durationText)
      .parentElement.parentElement.querySelector(
        '.InputNumeric__inputContainer--invalid'
      );
    expect(invalidDurationContainer).toBeInTheDocument();

    const invaliTimeZoneContainer = screen
      .getByText(timeZoneText)
      .parentElement.parentElement.querySelector('.kitmanReactSelect--invalid');

    expect(invaliTimeZoneContainer).toBeInTheDocument();
  });
});
