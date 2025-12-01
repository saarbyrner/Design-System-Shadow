import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import ColumnPanel from '../index';

jest.mock('../components/ComparisonPanel', () => ({
  __esModule: true,
  ComparisonPanelTranslated: () => (
    <div data-testid="ColumnPanel|ComparisonPanel" />
  ),
}));

jest.mock('../components/LongitudinalPanel', () => ({
  __esModule: true,
  LongitudinalPanelTranslated: () => (
    <div data-testid="ColumnPanel|LongitudinalPanel" />
  ),
}));

jest.mock('../components/ScorecardPanel', () => ({
  __esModule: true,
  ScorecardPanelTranslated: () => (
    <div data-testid="ColumnPanel|ScorecardPanel" />
  ),
}));

describe('<ColumnPanel />', () => {
  const onSetDateRangeMock = jest.fn();

  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    onSetDateRange: onSetDateRangeMock,
    timePeriod: TIME_PERIODS.today,
    availableVariables: [],
    metrics: [],
    onComparisonColumnApply: jest.fn(),
    onLongitudinalColumnApply: jest.fn(),
    onScorecardColumnApply: jest.fn(),
    selectedPopulation: {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    squadAthletes: {
      position_groups: [],
      positions: [],
      athletes: [],
    },
    squads: [],
    turnaroundList: [],
    t: i18nT,
    tableType: 'COMPARISON',
    isOpen: true,
  };

  beforeEach(() => {
    moment.tz.setDefault('UTC');
    const fakeNowDate = new Date('2024-07-10T15:30:10Z');
    jest.useFakeTimers();
    jest.setSystemTime(fakeNowDate);
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ColumnPanel {...props} />);

    expect(screen.getByText('Data Source')).toBeInTheDocument();
    expect(screen.getByText('Calculation')).toBeInTheDocument();
  });

  it('contains a SlidingPanel component', () => {
    render(<ColumnPanel {...props} />);
    expect(screen.getByText('Metrics')).toBeInTheDocument();
    expect(screen.getByTestId('panel-close-button')).toBeInTheDocument();
  });

  it('will not date range if time period not custom date', () => {
    render(<ColumnPanel {...props} />);
    expect(onSetDateRangeMock).not.toHaveBeenCalled();
  });

  it('will set date range if time period is custom date', () => {
    render(
      <ColumnPanel {...props} timePeriod={TIME_PERIODS.customDateRange} />
    );
    expect(onSetDateRangeMock).toHaveBeenCalledWith({
      end_date: '2024-07-10T23:59:59+00:00',
      start_date: '2024-07-10T00:00:00+00:00',
    });
  });

  describe('when the table type is COMPARISON', () => {
    describe('when on step one', () => {
      it('contains the correct SlidingPanel title', () => {
        render(<ColumnPanel {...props} />);
        expect(screen.getByText('Metrics')).toBeInTheDocument();
      });

      it('contains a grouped dropdown component for data source', () => {
        render(<ColumnPanel {...props} />);
        expect(screen.getByText('Calculation')).toBeInTheDocument();
        expect(screen.getByText('Data Source')).toBeInTheDocument();
      });

      it('contains a next step button with the correct text', () => {
        const { container } = render(<ColumnPanel {...props} />);

        const calculationButton = container.querySelector('.icon-next-right');
        expect(calculationButton).toBeInTheDocument();
      });
    });

    describe('when on step two', () => {
      beforeEach(() => {
        jest.useRealTimers();
      });
      it('contains the correct SlidingPanel title', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} />);

        const calculationButton = screen.getByText('Calculation');
        await user.click(calculationButton);

        expect(screen.getByText('Metrics / Calculation')).toBeInTheDocument();
      });

      it('contains a calculation dropdown', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} />);

        const calculationButton = screen.getByText('Calculation');
        await user.click(calculationButton);

        expect(screen.getByText('Sum')).toBeInTheDocument();
        expect(screen.getByText('Sum (Absolute)')).toBeInTheDocument();
        expect(screen.getByText('Min (Absolute)')).toBeInTheDocument();
      });

      it('contains a next step button with the correct text', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} />);

        const calculationButton = screen.getByText('Calculation');
        await user.click(calculationButton);

        expect(screen.getByText('Session & Periods')).toBeInTheDocument();
      });

      it('contains a last step button with the correct text', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} />);

        const calculationButton = screen.getByText('Calculation');
        await user.click(calculationButton);

        expect(screen.getByText('Last')).toBeInTheDocument();
      });
    });

    describe('when on step three', () => {
      beforeEach(() => {
        jest.useRealTimers();
      });
      it('contains the correct SlidingPanel title', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} />);

        // Navigate to step 3
        await user.click(screen.getByText('Calculation'));
        await user.click(screen.getByText('Session & Periods'));

        expect(
          screen.getByText('Metrics / Calculation / Session & Periods')
        ).toBeInTheDocument();
      });

      it('contains a grouped dropdown for dates', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} />);

        // Navigate to step 3
        await user.click(screen.getByText('Calculation'));
        await user.click(screen.getByText('Session & Periods'));

        expect(screen.getByText('Date')).toBeInTheDocument();
      });

      it('contains an apply button with the correct text', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} />);

        // Navigate to step 3
        await user.click(screen.getByText('Calculation'));
        await user.click(screen.getByText('Session & Periods'));

        expect(screen.getByText('Apply')).toBeInTheDocument();
      });

      it('will not call props.onComparisonColumnApply when nothing is selected and Apply is clicked', async () => {
        const user = userEvent.setup();
        const onComparisonColumnApply = jest.fn();
        render(
          <ColumnPanel
            {...props}
            onComparisonColumnApply={onComparisonColumnApply}
          />
        );

        await user.click(screen.getByText('Calculation'));
        await user.click(screen.getByText('Session & Periods'));
        await user.click(screen.getByText('Apply'));

        expect(onComparisonColumnApply).not.toHaveBeenCalled();
      });

      it('contains set period element with the correct text', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} />);

        await user.click(screen.getByText('Calculation'));
        await user.click(screen.getByText('Session & Periods'));

        expect(screen.getByText('Set Period')).toBeInTheDocument();
      });
    });
  });

  describe('when the table type is SCORECARD', () => {
    describe('when on step one', () => {
      it('contains the correct SlidingPanel title', () => {
        render(<ColumnPanel {...props} tableType="SCORECARD" />);
        expect(
          screen.getByText('#sport_specific__Athlete')
        ).toBeInTheDocument();
      });

      it('renders a single selection AthleteSelector component', () => {
        render(<ColumnPanel {...props} tableType="SCORECARD" />);

        expect(screen.getAllByText('Select All')).toHaveLength(2);
        expect(screen.getAllByText('Clear')).toHaveLength(2);
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      });

      it('contains a next step button with the correct text', () => {
        const { container } = render(
          <ColumnPanel {...props} tableType="SCORECARD" />
        );

        const calculationButton = container.querySelector('.icon-next-right');
        expect(calculationButton).toBeInTheDocument();
      });
    });

    describe('when on step two', () => {
      beforeEach(() => {
        jest.useRealTimers();
      });
      it('contains the correct SlidingPanel title', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} tableType="SCORECARD" />);

        const nextButton = screen.getByText('Session & Periods');
        await user.click(nextButton);

        expect(
          screen.getByText('#sport_specific__Athlete / Session & Periods')
        ).toBeInTheDocument();
      });

      it('contains a grouped dropdown for dates', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} tableType="SCORECARD" />);

        const nextButton = screen.getByText('Session & Periods');
        await user.click(nextButton);

        expect(screen.getByText('Date')).toBeInTheDocument();
      });

      it('contains an apply button with the correct text', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} tableType="SCORECARD" />);

        const nextButton = screen.getByText('Session & Periods');
        await user.click(nextButton);

        expect(screen.getByText('Apply')).toBeInTheDocument();
      });

      it('will not call props.onScorecardColumnApply when nothing is selected and Apply is clicked', async () => {
        const user = userEvent.setup();
        const onScorecardColumnApply = jest.fn();
        render(
          <ColumnPanel
            {...props}
            tableType="SCORECARD"
            onScorecardColumnApply={onScorecardColumnApply}
          />
        );

        const nextButton = screen.getByText('Session & Periods');
        await user.click(nextButton);

        await user.click(screen.getByText('Apply'));
        expect(onScorecardColumnApply).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the table type is LONGITUDINAL', () => {
    describe('when on step one', () => {
      it('contains the correct SlidingPanel title', () => {
        render(<ColumnPanel {...props} tableType="LONGITUDINAL" />);
        expect(screen.getByText('Metrics')).toBeInTheDocument();
      });

      it('contains a grouped dropdown component for data source', () => {
        render(<ColumnPanel {...props} tableType="LONGITUDINAL" />);
        expect(screen.getByText('Data Source')).toBeInTheDocument();
      });
    });

    describe('when on step two', () => {
      beforeEach(() => {
        jest.useRealTimers();
      });
      it('contains the correct SlidingPanel title', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} tableType="LONGITUDINAL" />);

        const nextButton = screen.getByText('Calculation');
        await user.click(nextButton);

        expect(screen.getByText('Metrics / Calculation')).toBeInTheDocument();
      });

      it('contains a calculation dropdown', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} tableType="LONGITUDINAL" />);

        const nextButton = screen.getByText('Calculation');
        await user.click(nextButton);

        expect(screen.getByText('Calculation')).toBeInTheDocument();
      });
    });

    describe('when on step three', () => {
      beforeEach(() => {
        jest.useRealTimers();
      });
      it('contains the correct SlidingPanel title', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} tableType="LONGITUDINAL" />);

        // Navigate to step 3
        await user.click(screen.getByText('Calculation'));
        await user.click(screen.getByText('#sport_specific__Athlete'));

        expect(
          screen.getByText('Metrics / Calculation / #sport_specific__Athlete')
        ).toBeInTheDocument();
      });

      it('renders a single selection AthleteSelector component', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} tableType="LONGITUDINAL" />);

        await user.click(screen.getByText('Calculation'));
        await user.click(screen.getByText('#sport_specific__Athlete'));

        expect(screen.getAllByText('Select All')).toHaveLength(2);
        expect(screen.getAllByText('Clear')).toHaveLength(2);
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      });

      it('contains an apply button with the correct text', async () => {
        const user = userEvent.setup();
        render(<ColumnPanel {...props} tableType="LONGITUDINAL" />);

        await user.click(screen.getByText('Calculation'));
        await user.click(screen.getByText('#sport_specific__Athlete'));

        expect(screen.getByText('Apply')).toBeInTheDocument();
      });

      it('will not call props.onLongitudinalColumnApply when nothing is selected and Apply is clicked', async () => {
        const user = userEvent.setup();
        const onLongitudinalColumnApply = jest.fn();
        render(
          <ColumnPanel
            {...props}
            tableType="LONGITUDINAL"
            onLongitudinalColumnApply={onLongitudinalColumnApply}
          />
        );

        await user.click(screen.getByText('Calculation'));
        await user.click(screen.getByText('#sport_specific__Athlete'));
        await user.click(screen.getByText('Apply'));

        expect(onLongitudinalColumnApply).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the table-widget-creation-sidepanel-ui FF is active', () => {
    beforeEach(() => {
      window.setFlag('table-widget-creation-sidepanel-ui', true);
    });

    afterEach(() => {
      window.setFlag('table-widget-creation-sidepanel-ui', false);
    });

    it('renders the correct title', () => {
      render(<ColumnPanel {...props} />);
      expect(screen.getByText('Add Column')).toBeInTheDocument();
    });

    it('renders the correct title in edit mode', () => {
      render(<ColumnPanel {...props} isEditMode />);
      expect(screen.getByText('Edit Column')).toBeInTheDocument();
    });

    it('renders the ComparisonPanel for tableType COMPARISON', () => {
      render(<ColumnPanel {...props} tableType="COMPARISON" />);
      expect(
        screen.getByTestId('ColumnPanel|ComparisonPanel')
      ).toBeInTheDocument();
    });

    it('renders the LongitudinalPanel for tableType LONGITUDINAL', () => {
      render(<ColumnPanel {...props} tableType="LONGITUDINAL" />);
      expect(
        screen.getByTestId('ColumnPanel|LongitudinalPanel')
      ).toBeInTheDocument();
    });

    it('renders the ScorecardPanel for tableType SCORECARD', () => {
      render(<ColumnPanel {...props} tableType="SCORECARD" />);
      expect(
        screen.getByTestId('ColumnPanel|ScorecardPanel')
      ).toBeInTheDocument();
    });
  });
});
