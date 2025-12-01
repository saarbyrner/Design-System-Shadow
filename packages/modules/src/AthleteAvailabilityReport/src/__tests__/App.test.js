import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import $ from 'jquery';
import App from '../components/App';
import { athleteData, expandedAthleteData } from '../../utils/dummyAthleteData';

jest.mock('@kitman/components/src/DateRangePicker', () => (props) => (
  <div>
    <button
      type="button"
      onClick={() =>
        props.onChange({
          start_date: '2018-09-10T00:00:00Z',
          end_date: '2018-09-10T23:59:59Z',
        })
      }
    >
      Date Range Picker
    </button>
  </div>
));

jest.mock('../components/SideBar', () => ({
  SideBarTranslated: (props) => (
    <div data-testid="sidebar">
      <button
        type="button"
        onClick={() => props.onExpandAthleteClick(props.athletes[0].id)}
      >
        {props.athletes[0].full_name}
      </button>
    </div>
  ),
}));

jest.mock('../components/Header', () => ({
  HeaderTranslated: () => <div data-testid="header" />,
}));

jest.mock('../components/Body', () => ({
  BodyTranslated: (props) => (
    <div data-testid="body">
      {props.expandedAthleteData &&
      Object.keys(props.expandedAthleteData).length > 0 ? (
        <div data-testid="expanded-row">International Duty</div>
      ) : null}
    </div>
  ),
}));

jest.mock('../components/SidePanel', () => ({
  SidePanelTranslated: (props) => (
    <div data-testid="side-panel">
      {props.sessionDataByAthleteId &&
      Object.keys(props.sessionDataByAthleteId).length > 0 ? (
        <div data-testid="session-data">1/5</div>
      ) : null}
    </div>
  ),
}));

describe('Availability Report <App /> component', () => {
  let props;
  const { location } = window;

  beforeEach(() => {
    props = {
      athletes: athleteData(),
      canViewIssues: true,
      canViewAbsence: true,
      timeRangeStart: '2018-09-02T14:00:00Z',
      timeRangeEnd: '2018-10-01T13:59:59Z',
      orgTimeZone: 'Europe/Dublin',
      injuryStatuses: [
        {
          cause_unavailability: true,
          description: 'Causing unavailability (time-loss)',
          id: 1,
          injury_status_system_id: 1,
          order: 1,
          restore_availability: false,
        },
        {
          cause_unavailability: false,
          description: 'Not affecting availability (medical attention)',
          id: 2,
          injury_status_system_id: 1,
          order: 2,
          restore_availability: true,
        },
        {
          cause_unavailability: false,
          description: 'Resolved',
          id: 3,
          injury_status_system_id: 1,
          order: 3,
          restore_availability: true,
        },
      ],
      t: (key) => key,
    };

    delete window.location;
    window.location = { assign: jest.fn() };
  });

  afterEach(() => {
    window.location = location;
  });

  it('renders', () => {
    render(<App {...props} />);
    expect(screen.getByText('Legend')).toBeInTheDocument();
  });

  it('renders the correct legend items', () => {
    const { container } = render(<App {...props} />);
    expect(
      container.querySelectorAll('.availabilityReportTableHeader__legendItem')
        .length
    ).toBe(3);
  });

  describe('when the legend opener is clicked', () => {
    it('opens the legend', async () => {
      const user = userEvent.setup();
      render(<App {...props} />);
      const legendOpener = screen.getByText('Legend');
      await user.click(legendOpener);
      // After clicking, the legend items should be visible
      expect(
        screen.getByText('Causing unavailability (time-loss)')
      ).toBeVisible();
    });
  });

  describe('when the date range is changed', () => {
    it('sets the correct window location', async () => {
      const user = userEvent.setup();
      render(<App {...props} />);
      const datePicker = screen.getByText('Date Range Picker');
      await user.click(datePicker);
      expect(window.location.assign).toHaveBeenCalledWith(
        '/athletes/availability_report?start_date=2018-09-10T00:00:00Z&end_date=2018-09-10T23:59:59Z'
      );
    });
  });

  describe('when expanding an athlete', () => {
    const expandedDummyData = expandedAthleteData();
    it('fetches and displays expanded data on click', async () => {
      const ajaxSpy = jest.spyOn($, 'ajax').mockImplementation((options) => {
        if (
          options.url ===
          `/athletes/${props.athletes[0].id}/availability_report`
        ) {
          return $.Deferred().resolve(expandedDummyData).promise();
        }
        return $.Deferred().resolve({}).promise();
      });

      const user = userEvent.setup();
      render(<App {...props} />);

      const athleteRow = screen.getByText(props.athletes[0].full_name);
      await user.click(athleteRow);

      expect(await screen.findByTestId('expanded-row')).toBeInTheDocument();
      ajaxSpy.mockRestore();
    });
  });

  describe('when populating the missed games and trainings and the feature flag is enabled', () => {
    const sessionData = {
      stats: [
        {
          full_name: 'Jon Doe',
          id: '33925',
          stats: {
            games: { missed: 1, percentage: 20, total: 5 },
            training_sessions: { missed: 1, percentage: 20, total: 5 },
          },
        },
      ],
    };

    let ajaxSpy;
    beforeEach(() => {
      window.featureFlags = {
        'missing-games-ts-availability-report': true,
      };
      ajaxSpy = jest.spyOn($, 'ajax').mockImplementation((options) => {
        if (options.url === '/athletes/availability_report/stats') {
          return $.Deferred().resolve(sessionData).promise();
        }
        return $.Deferred().resolve({}).promise();
      });
    });

    afterEach(() => {
      window.featureFlags = {};
      ajaxSpy.mockRestore();
    });

    it('fetches and displays session data', async () => {
      render(<App {...props} />);
      expect(await screen.findByTestId('session-data')).toBeInTheDocument();
    });
  });
});
