import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthleteAvailabilityHistoryDetails from '../../components/AthleteAvailabilityHistoryDetails';

describe('Athlete Issue Details <AthleteAvailabilityHistoryDetails /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      events: [
        {
          id: 1,
          date: '2018-05-11',
          description: 'Not fit for training or match',
          injury_status_id: 'option_1234',
          cause_unavailability: true,
        },
        {
          id: 2,
          date: '2018-05-16',
          description:
            'Fit for modified team training, but not match selection',
          injury_status_id: 'option_1236',
          cause_unavailability: true,
        },
        {
          id: 3,
          date: '2018-05-20',
          description:
            'Fit for match selection, no training modifications. Recovered.',
          injury_status_id: 'option_1237',
          cause_unavailability: false,
        },
      ],
      eventsDuration: {
        1: 3,
        2: 4,
        3: 3,
      },
      unavailabilityDuration: 6,
      totalDuration: 10,
      isIssueClosed: false,
      orgTimeZone: 'Europe/Dublin',
      t: i18nextTranslateStub(),
    };
  });

  it('renders', () => {
    render(<AthleteAvailabilityHistoryDetails {...props} />);
    expect(screen.getByText('Availability History')).toBeInTheDocument();
  });

  it('displays the correct number of events', () => {
    render(<AthleteAvailabilityHistoryDetails {...props} />);
    const rows = screen.getAllByText(/May/);
    expect(rows.length).toBe(3);
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('displays the correct dates', () => {
      render(<AthleteAvailabilityHistoryDetails {...props} />);
      expect(screen.getByText('11 May 2018')).toBeInTheDocument();
      expect(screen.getByText('16 May 2018')).toBeInTheDocument();
      expect(screen.getByText('20 May 2018')).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('displays the correct dates', () => {
      render(<AthleteAvailabilityHistoryDetails {...props} />);
      expect(screen.getByText('May 11, 2018')).toBeInTheDocument();
      expect(screen.getByText('May 16, 2018')).toBeInTheDocument();
      expect(screen.getByText('May 20, 2018')).toBeInTheDocument();
    });
  });

  it('displays the correct status name', () => {
    render(<AthleteAvailabilityHistoryDetails {...props} />);
    expect(
      screen.getByText('Not fit for training or match')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Fit for modified team training, but not match selection'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Fit for match selection, no training modifications. Recovered.'
      )
    ).toBeInTheDocument();
  });

  it('displays the correct event duration', () => {
    render(<AthleteAvailabilityHistoryDetails {...props} />);
    const durations = screen.getAllByText(/days/);
    expect(durations[0]).toHaveTextContent('3 days');
    expect(durations[1]).toHaveTextContent('4 days');
    expect(durations[2]).toHaveTextContent('3 days');
  });

  it('displays the correct total duration', () => {
    render(<AthleteAvailabilityHistoryDetails {...props} />);
    expect(screen.getByText('10 days')).toBeInTheDocument();
  });

  it('displays the correct total unavailability', () => {
    render(<AthleteAvailabilityHistoryDetails {...props} />);
    expect(screen.getByText('6 days')).toBeInTheDocument();
  });

  describe('When the issue is closed', () => {
    it('hides the last event duration', () => {
      render(<AthleteAvailabilityHistoryDetails {...props} isIssueClosed />);
      const durations = screen.getAllByText(/days/);
      expect(durations.length).toBe(4);
    });
  });

  describe('when the issue-collapsable-reorder feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['issue-collapsable-reorder'] = true;
    });

    afterEach(() => {
      window.featureFlags['issue-collapsable-reorder'] = false;
    });

    it('does not render the title', () => {
      render(<AthleteAvailabilityHistoryDetails {...props} isIssueClosed />);
      expect(
        screen.queryByText('Availability History')
      ).not.toBeInTheDocument();
    });
  });
});
