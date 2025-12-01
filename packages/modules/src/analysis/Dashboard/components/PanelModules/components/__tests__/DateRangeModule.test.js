import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { EVENT_TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import DateRangeModule from '../DateRangeModule';
import LastXEvents from '../DateRangeModule/LastXEvents';

describe('<DateRangeModule />', () => {
  const props = {
    dateRange: {},
    onSetDateRange: jest.fn(),
    onSetTimePeriod: jest.fn(),
    onSetTimePeriodLength: jest.fn(),
    onSetTimePeriodLengthOffset: jest.fn(),
    timePeriod: '',
    timePeriodLength: 0,
    timePeriodLengthOffset: 0,
    turnaroundList: [],
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithStore(<DateRangeModule {...props} />);

    expect(screen.getByLabelText('Date')).toBeInTheDocument();
  });

  it('calls onSetTimePeriod with a new selection when changed', async () => {
    const user = userEvent.setup();
    const onSetTimePeriod = jest.fn();

    renderWithStore(
      <DateRangeModule {...props} onSetTimePeriod={onSetTimePeriod} />
    );

    const dateSelect = screen.getByLabelText('Date');
    await user.click(dateSelect);

    // Select the second option
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onSetTimePeriod).toHaveBeenCalled();
  });

  it('renders the DateRangePicker when custom_date_range timeperiod is selected', () => {
    renderWithStore(
      <DateRangeModule {...props} timePeriod="custom_date_range" />
    );

    expect(screen.getByText('Select Date Range')).toBeInTheDocument();
  });

  it('renders the lastXDaysSelector when last_x_days timeperiod is selected', () => {
    renderWithStore(<DateRangeModule {...props} timePeriod="last_x_days" />);

    expect(screen.getByLabelText('Last')).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Weeks')).toBeInTheDocument();
  });

  describe('when the graphing-offset-calc is true', () => {
    beforeEach(() => {
      window.setFlag('graphing-offset-calc', true);
    });

    afterEach(() => {
      window.setFlag('graphing-offset-calc', false);
    });

    it('renders last x period offset when graphing-offset-calc feature flag is true', () => {
      window.setFlag('graphing-offset-calc', true);
      renderWithStore(<DateRangeModule {...props} timePeriod="last_x_days" />);

      expect(screen.getByText('Offset date range')).toBeInTheDocument();
    });
  });

  it('renders last x events selector when last_x_events is selected', () => {
    renderWithStore(<DateRangeModule {...props} timePeriod="last_x_events" />);

    expect(screen.getAllByText('Events')).toHaveLength(2);
    expect(screen.getByText('Offset period')).toBeInTheDocument();
  });

  it('does not have the option last x events when hideLastXEvents is true', () => {
    window.setFlag('table-widget-last-x-events', true);

    renderWithStore(<DateRangeModule {...props} hideLastXEvents />);

    expect(screen.queryByLabelText('Last (x) Events')).not.toBeInTheDocument();
  });

  it('does not show last X options when [rep-last-x-games-and-sessions] is false', async () => {
    window.setFlag('rep-last-x-games-and-sessions', false);
    const user = userEvent.setup();

    renderWithStore(<DateRangeModule {...props} showLastGamesAndSessions />);

    const dateSelect = screen.getByLabelText('Date');
    await user.click(dateSelect);

    expect(
      screen.queryByText('Last (x) Games/Sessions')
    ).not.toBeInTheDocument();
  });

  describe('when the fature flag [rep-last-x-games-and-sessions] is true', () => {
    beforeEach(() => {
      window.setFlag('rep-last-x-games-and-sessions', true);
    });

    afterEach(() => {
      window.setFlag('rep-last-x-games-and-sessions', false);
    });

    it('shows "Last (x) Games/Sessions" option when showLastGamesAndSessions is true', async () => {
      const user = userEvent.setup();

      renderWithStore(<DateRangeModule {...props} showLastGamesAndSessions />);

      const dateSelect = screen.getByLabelText('Date');
      await user.click(dateSelect);

      expect(screen.getByText('Last (x) Games/Sessions')).toBeInTheDocument();
    });

    it('does not show "Last (x) Games/Sessions" when showLastGamesAndSessions is false', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <DateRangeModule {...props} showLastGamesAndSessions={false} />
      );

      const dateSelect = screen.getByLabelText('Date');
      await user.click(dateSelect);

      expect(
        screen.queryByText('Last (x) Games/Sessions')
      ).not.toBeInTheDocument();
    });

    it('calls onSetTimePeriodConfig with config with the expected payload', async () => {
      const user = userEvent.setup();
      const onSetTimePeriodConfig = jest.fn();
      const onSetTimePeriod = jest.fn();

      renderWithStore(
        <DateRangeModule
          {...props}
          showLastGamesAndSessions
          onSetTimePeriodConfig={onSetTimePeriodConfig}
          onSetTimePeriod={onSetTimePeriod}
        />
      );

      const dateSelect = screen.getByLabelText('Date');
      await user.click(dateSelect);

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(onSetTimePeriodConfig).toHaveBeenCalledWith(
        expect.objectContaining({ event_types: ['game'] })
      );
    });
    it('calls onSetTimePeriodConfig when showLastGamesAndSessions is false and config is present', async () => {
      const onSetTimePeriodConfig = jest.fn();
      const onSetTimePeriod = jest.fn();

      renderWithStore(
        <DateRangeModule
          {...props}
          onSetTimePeriodConfig={onSetTimePeriodConfig}
          onSetTimePeriod={onSetTimePeriod}
          config={{ event_types: ['game'] }}
        />
      );

      expect(onSetTimePeriodConfig).toHaveBeenCalledWith({});
      expect(onSetTimePeriod).toHaveBeenCalledWith(null);
    });

    it('calls onSetTimePeriodConfig with empty config when non-last x event is selected', async () => {
      const user = userEvent.setup();
      const onSetTimePeriodConfig = jest.fn();
      const onSetTimePeriod = jest.fn();

      renderWithStore(
        <DateRangeModule
          {...props}
          showLastGamesAndSessions
          onSetTimePeriodConfig={onSetTimePeriodConfig}
          onSetTimePeriod={onSetTimePeriod}
        />
      );

      const dateSelect = screen.getByLabelText('Date');
      await user.click(dateSelect);

      // Select a non-last x events option
      await user.keyboard('{ArrowDown}'.repeat(4));
      await user.keyboard('{Enter}');

      expect(onSetTimePeriodConfig).toHaveBeenCalledWith({});
    });

    it('call onSetTimePeriod with the expected arguments', async () => {
      const user = userEvent.setup();
      const onSetTimePeriod = jest.fn();

      renderWithStore(
        <DateRangeModule
          {...props}
          onSetTimePeriod={onSetTimePeriod}
          showLastGamesAndSessions
        />
      );

      const dateSelect = screen.getByLabelText('Date');
      await user.click(dateSelect);

      await user.keyboard('{ArrowDown}'.repeat(2));
      await user.keyboard('{Enter}');

      expect(onSetTimePeriod).toHaveBeenCalledWith(
        EVENT_TIME_PERIODS.lastXEvents
      );
    });

    it('does not reset timePeriod and timePeriodConfig when last x events is not selected', () => {
      const onSetTimePeriodConfig = jest.fn();
      const onSetTimePeriod = jest.fn();

      renderWithStore(
        <DateRangeModule
          {...props}
          timePeriod="today" // timePeriod is defined in edit mode
          onSetTimePeriodConfig={onSetTimePeriodConfig}
          onSetTimePeriod={onSetTimePeriod}
          config={{ event_types: [] }} // event_types is empty by default
        />
      );

      expect(screen.getByText('Today')).toBeInTheDocument(); // does not reset timePeriod
      expect(onSetTimePeriodConfig).not.toHaveBeenCalledWith({});
      expect(onSetTimePeriod).not.toHaveBeenCalledWith(null);
    });
  });

  describe('DateRangeModule > LastXEvents', () => {
    const lastXEventsProps = {
      timePeriodLength: undefined,
      timePeriodLengthOffset: undefined,
      onSetTimePeriodLength: jest.fn(),
      onSetTimePeriodLengthOffset: jest.fn(),
      timePeriodValue: EVENT_TIME_PERIODS.lastXEvents,
      t: i18nextTranslateStub(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders', () => {
      renderWithStore(<LastXEvents {...lastXEventsProps} />);

      expect(screen.getByText('Last')).toBeInTheDocument();
      expect(screen.getAllByText('Events')).toHaveLength(2);
      expect(screen.getByText('Offset period')).toBeInTheDocument();
    });

    it('renders time period input with the correct value', () => {
      renderWithStore(
        <LastXEvents {...lastXEventsProps} timePeriodLength={5} />
      );

      const timePeriodInput = screen.getByDisplayValue('5');
      expect(timePeriodInput).toBeInTheDocument();
    });

    it('does not render the offset when the period switch has been toggled', async () => {
      const user = userEvent.setup();
      renderWithStore(<LastXEvents {...lastXEventsProps} />);

      expect(screen.getByText('Offset')).toBeInTheDocument();

      const offsetToggle = screen.getByRole('switch');
      await user.click(offsetToggle);

      await waitFor(() =>
        expect(screen.queryByText('Offset')).not.toBeInTheDocument()
      );
    });

    it('calls the onSetTimePeriodLengthOffset when offset is visible and the value changes', async () => {
      const onSetTimePeriodLengthOffset = jest.fn();

      renderWithStore(
        <LastXEvents
          {...lastXEventsProps}
          onSetTimePeriodLengthOffset={onSetTimePeriodLengthOffset}
        />
      );

      expect(screen.getByText('Offset')).toBeInTheDocument();
      const evaluatedPeriodContainer = screen
        .getByText('Offset')
        .closest('.InputNumeric');
      const evaluatedPeriodInput = evaluatedPeriodContainer.querySelector(
        '[data-validatetype="inputNumeric"]'
      );

      await fireEvent.change(evaluatedPeriodInput, { target: { value: '3' } });
      expect(onSetTimePeriodLengthOffset).toHaveBeenCalledTimes(1);
    });

    it('renders the expected label Games/Sessions', () => {
      renderWithStore(
        <LastXEvents
          {...lastXEventsProps}
          timePeriodValue={EVENT_TIME_PERIODS.lastXGamesAndSessions}
        />
      );

      expect(screen.getByText('Last')).toBeInTheDocument();
      expect(screen.getAllByText('Games/Sessions')).toHaveLength(2);
      expect(screen.getByText('Offset period')).toBeInTheDocument();
    });

    it('renders the expected label Games', () => {
      renderWithStore(
        <LastXEvents
          {...lastXEventsProps}
          timePeriodValue={EVENT_TIME_PERIODS.lastXGames}
        />
      );

      expect(screen.getByText('Last')).toBeInTheDocument();
      expect(screen.getAllByText('Games')).toHaveLength(2);
      expect(screen.getByText('Offset period')).toBeInTheDocument();
    });
  });
});
